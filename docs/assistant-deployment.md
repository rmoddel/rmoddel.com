# Assistant Deployment

This project supports two assistant backends behind one env switch:

- `ollama` for local development
- `bedrock` for production on AWS Amplify

The switch is controlled by:

```bash
ASSISTANT_PROVIDER=ollama
```

or

```bash
ASSISTANT_PROVIDER=bedrock
```

## How It Works

The assistant route is [app/api/assistant/route.ts](/Users/rmoddel/code/rmo/rmoddel.com/app/api/assistant/route.ts:1).

- If `ASSISTANT_PROVIDER=ollama`, the app calls your local Ollama server.
- If `ASSISTANT_PROVIDER=bedrock`, the app calls Amazon Bedrock through the AWS SDK.
- If the selected provider fails, the app falls back to deterministic site-content answers.

## Local Development With Ollama

### 1. Install Ollama

Install Ollama from:

- `https://ollama.com/download`

### 2. Start Ollama

Run:

```bash
ollama serve
```

### 3. Pull a model

Example:

```bash
ollama pull llama3.2:3b
```

### 4. Confirm the model name

Run:

```bash
ollama list
```

Use the exact model tag shown there as `OLLAMA_MODEL`.

### 5. Configure `.env.local`

Set:

```bash
ASSISTANT_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

### 6. Restart the app

Run:

```bash
npm run dev
```

### 7. Verify Ollama directly

Run:

```bash
curl http://127.0.0.1:11434/api/chat -d '{
  "model": "llama3.2:3b",
  "stream": false,
  "messages": [
    { "role": "user", "content": "Say hello in one sentence." }
  ]
}'
```

If this works, the website can use Ollama.

## Production On Amplify With Bedrock

Do not try to run Ollama inside Amplify Hosting. Use Bedrock for production instead.

### 1. Pick a Bedrock Region

Choose a Region where:

- Amazon Bedrock is available
- your target model is available
- your Amplify app can reach it

Example:

```bash
BEDROCK_REGION=us-east-1
```

## 2. Get model access in Bedrock

In AWS Console:

1. Open Amazon Bedrock.
2. Go to model access.
3. Request access for the model you want to use if required.
4. Wait until access is granted.

Use the exact model ID as `BEDROCK_MODEL_ID`.

Example:

```bash
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

Notes:

- Some models require an explicit access request.
- Model availability is Region-specific.
- If the model is not enabled in the same Region you configured, calls will fail.

### 3. Add an SSR Compute role in Amplify

For Amplify SSR apps, the correct AWS-side integration point is the SSR Compute role.

In AWS documentation, this role is what allows your server-side app to access services such as Amazon Bedrock.

Create or choose an IAM role for Amplify SSR compute, then assign it to the app.

The role needs permission to invoke Bedrock models.

Minimum practical policy for this project:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockInference",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    }
  ]
}
```

If you later add streaming, inference profiles, or guardrails, you will need more actions.

Safer broader policy from the Bedrock inference prerequisites includes:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ModelInvocationPermissions",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:GetInferenceProfile",
        "bedrock:ListInferenceProfiles",
        "bedrock:RenderPrompt",
        "bedrock:GetCustomModel",
        "bedrock:ListCustomModels",
        "bedrock:GetImportedModel",
        "bedrock:ListImportedModels",
        "bedrock:GetProvisionedModelThroughput",
        "bedrock:ListProvisionedModelThroughputs",
        "bedrock:GetGuardrail",
        "bedrock:ListGuardrails",
        "bedrock:ApplyGuardrail"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4. Attach the role to the Amplify app

In the Amplify console:

1. Open your app.
2. Open app settings.
3. Find the SSR Compute role setting.
4. Assign the IAM role that has the Bedrock permissions.

Without this role, the app will deploy but Bedrock calls from the server route will fail with permissions errors.

### 5. Add Amplify environment variables

In Amplify, set:

```bash
EMAIL_API_URL=
EMAIL_API_SECRET=
EMAIL_FROM=
CONTACT_TO=
ASSISTANT_PROVIDER=bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

Important:

- The contact form and assistant email flow both use `/api/contact`, so production needs the four contact email variables as SSR environment variables.
- Contact email variables are captured during `next build`; redeploy the branch after changing them in Amplify.
- Do not create your own env var with an `AWS_` prefix in Amplify. Amplify reserves that prefix.
- This is why this project uses `BEDROCK_REGION` instead of telling you to define `AWS_REGION`.

### 6. Redeploy Amplify

After setting the env vars and compute role, trigger a new deployment.

### 7. Verify production

Check:

1. The site deploys successfully.
2. The assistant widget opens normally.
3. Asking a question returns a model answer, not the fallback path.
4. CloudWatch SSR logs do not show Bedrock auth, region, or model-access errors.

## Bedrock Implementation Details In This Repo

The Bedrock implementation is already wired in:

- [app/api/assistant/route.ts](/Users/rmoddel/code/rmo/rmoddel.com/app/api/assistant/route.ts:1)
- [app/api/assistant/health/route.ts](/Users/rmoddel/code/rmo/rmoddel.com/app/api/assistant/health/route.ts:1)
- [lib/assistant.ts](/Users/rmoddel/code/rmo/rmoddel.com/lib/assistant.ts:1)
- [lib/assistant-provider.ts](/Users/rmoddel/code/rmo/rmoddel.com/lib/assistant-provider.ts:1)

What the route does:

1. Reads `ASSISTANT_PROVIDER`
2. Chooses `ollama` or `bedrock`
3. For Bedrock, creates a `BedrockRuntimeClient`
4. Sends the conversation with `ConverseCommand`
5. Returns the model text to the widget
6. Falls back to site-knowledge answers if the provider call fails

The health route reports:

- current provider
- configured model
- whether the provider check succeeded
- a short error when the provider is misconfigured or unreachable

The relevant Bedrock env vars are:

```bash
ASSISTANT_PROVIDER=bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

## Common Failure Cases

### `AccessDeniedException`

Cause:

- the Amplify SSR Compute role does not have Bedrock permissions
- model access was not granted in Bedrock

### `ValidationException` or model not found

Cause:

- wrong `BEDROCK_MODEL_ID`
- model not available in `BEDROCK_REGION`

### App uses fallback instead of Bedrock

Cause:

- `ASSISTANT_PROVIDER` not set to `bedrock`
- missing env vars
- Bedrock request failed and the route fell back to site knowledge

### Amplify env var issue

Cause:

- trying to define a custom env var starting with `AWS_`

Use `BEDROCK_REGION`, not `AWS_REGION`.

## Recommended First Production Setup

Use:

```bash
ASSISTANT_PROVIDER=bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

Then give the Amplify SSR Compute role Bedrock invocation permission and redeploy.
