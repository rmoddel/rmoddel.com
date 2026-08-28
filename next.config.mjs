/** @type {import('next').NextConfig} */
const buildTimeServerEnvKeys = [
  "EMAIL_API_URL",
  "EMAIL_API_SECRET",
  "EMAIL_FROM",
  "CONTACT_TO",
  "ASSISTANT_PROVIDER",
  "BEDROCK_MODEL_ID",
  "BEDROCK_REGION"
];

const buildTimeServerEnv = Object.fromEntries(
  buildTimeServerEnvKeys
    .filter((key) => process.env[key])
    .map((key) => [key, process.env[key]])
);

const nextConfig = {
  reactStrictMode: true,
  env: buildTimeServerEnv
};

export default nextConfig;
