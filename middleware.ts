import { NextResponse, type NextRequest } from "next/server";
import { AUTH_USERNAME, getAuthPassword } from "@/lib/auth-firewall";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="rmoddel.com auth", charset="UTF-8"'
    }
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  const encodedCredentials = authorization.slice("Basic ".length);

  try {
    const decoded = atob(encodedCredentials);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (username !== AUTH_USERNAME || password !== getAuthPassword()) {
      return unauthorized();
    }

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/auth/:path*"]
};
