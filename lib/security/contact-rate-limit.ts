import { createHash } from "crypto";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
  persistent: boolean;
};

type Bucket = {
  count: number;
  resetAt: number;
};

type UpstashResponse<T> = {
  result?: T;
  error?: string;
};

const IP_ATTEMPT_LIMIT = 5;
const IP_ATTEMPT_WINDOW_SECONDS = 15 * 60;
const EMAIL_SUCCESS_LIMIT = 3;
const EMAIL_SUCCESS_WINDOW_SECONDS = 60 * 60;
const localBuckets = new Map<string, Bucket>();

let warnedAboutLocalFallback = false;

function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return undefined;
  }

  return { url, token };
}

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 40);
}

function scopedKey(scope: "ip" | "email", value: string) {
  return `rmoddel:contact:${scope}:${hashKey(value || "unknown")}`;
}

function secondsUntil(resetAt: number) {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

async function upstashCommand<T>(command: Array<string | number>) {
  const config = getUpstashConfig();

  if (!config) {
    return undefined;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(4_000)
  });

  if (!response.ok) {
    throw new Error(`Upstash rate limit command failed with ${response.status}`);
  }

  const payload = (await response.json()) as UpstashResponse<T>;

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
}

async function getUpstashTtl(key: string, fallbackWindowSeconds: number) {
  const ttl = Number(await upstashCommand<number>(["TTL", key]));

  if (Number.isFinite(ttl) && ttl > 0) {
    return ttl;
  }

  return fallbackWindowSeconds;
}

async function incrementUpstashLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const count = Number(await upstashCommand<number>(["INCR", key]));

  if (!Number.isFinite(count)) {
    throw new Error("Upstash returned an invalid rate limit count");
  }

  if (count === 1) {
    await upstashCommand<number>(["EXPIRE", key, windowSeconds]);
  }

  const retryAfter = await getUpstashTtl(key, windowSeconds);
  const resetAt = Date.now() + retryAfter * 1000;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
    retryAfter,
    persistent: true
  };
}

async function readUpstashLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const rawCount = await upstashCommand<string | number | null>(["GET", key]);
  const count = Number(rawCount ?? 0);
  const retryAfter = count > 0 ? await getUpstashTtl(key, windowSeconds) : windowSeconds;
  const resetAt = Date.now() + retryAfter * 1000;

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    resetAt,
    retryAfter,
    persistent: true
  };
}

function warnAboutLocalFallback() {
  if (warnedAboutLocalFallback) {
    return;
  }

  warnedAboutLocalFallback = true;
  console.warn(
    "Persistent contact rate limiting is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in production."
  );
}

function incrementLocalLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  warnAboutLocalFallback();

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = localBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    localBuckets.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
      retryAfter: windowSeconds,
      persistent: false
    };
  }

  existing.count += 1;
  localBuckets.set(key, existing);

  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfter: secondsUntil(existing.resetAt),
    persistent: false
  };
}

function readLocalLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  warnAboutLocalFallback();

  const now = Date.now();
  const existing = localBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    return {
      allowed: true,
      remaining: limit,
      resetAt: now + windowSeconds * 1000,
      retryAfter: windowSeconds,
      persistent: false
    };
  }

  return {
    allowed: existing.count < limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfter: secondsUntil(existing.resetAt),
    persistent: false
  };
}

async function safeRateLimit<T extends RateLimitResult>(
  operation: () => Promise<T>,
  fallback: () => T
) {
  try {
    if (getUpstashConfig()) {
      return await operation();
    }
  } catch (error) {
    console.error("Persistent contact rate limit check failed", error);
  }

  return fallback();
}

export function getContactClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  return request.headers.get("x-real-ip")?.trim() || undefined;
}

export async function checkContactIpAttemptLimit(ip?: string) {
  const key = scopedKey("ip", ip || "unknown");

  return safeRateLimit(
    () => incrementUpstashLimit(key, IP_ATTEMPT_LIMIT, IP_ATTEMPT_WINDOW_SECONDS),
    () => incrementLocalLimit(key, IP_ATTEMPT_LIMIT, IP_ATTEMPT_WINDOW_SECONDS)
  );
}

export async function checkContactEmailSuccessLimit(email: string) {
  const key = scopedKey("email", email);

  return safeRateLimit(
    () => readUpstashLimit(key, EMAIL_SUCCESS_LIMIT, EMAIL_SUCCESS_WINDOW_SECONDS),
    () => readLocalLimit(key, EMAIL_SUCCESS_LIMIT, EMAIL_SUCCESS_WINDOW_SECONDS)
  );
}

export async function recordContactEmailSuccess(email: string) {
  const key = scopedKey("email", email);

  return safeRateLimit(
    () => incrementUpstashLimit(key, EMAIL_SUCCESS_LIMIT, EMAIL_SUCCESS_WINDOW_SECONDS),
    () => incrementLocalLimit(key, EMAIL_SUCCESS_LIMIT, EMAIL_SUCCESS_WINDOW_SECONDS)
  );
}
