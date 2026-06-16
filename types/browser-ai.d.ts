type LanguageModelMessage =
  | string
  | {
      role: "system" | "user" | "assistant";
      content: string;
    }
  | Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>;

type LanguageModelAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

interface LanguageModelSession {
  prompt(input: LanguageModelMessage): Promise<string>;
  destroy?: () => void;
}

interface LanguageModelCreateOptions {
  expectedInputs?: Array<{ type: "text"; languages?: string[] }>;
  expectedOutputs?: Array<{ type: "text"; languages?: string[] }>;
  initialPrompts?: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
}

interface LanguageModelStatic {
  availability(options?: LanguageModelCreateOptions): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

interface Window {
  LanguageModel: LanguageModelStatic;
}
