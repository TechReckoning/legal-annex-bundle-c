/// <reference types="vite/client" />

declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Add missing type declarations
type NoInfer<T> = [T][T extends any ? 0 : never];

// Extend global window interface for spark runtime
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string;
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>;
      user: () => Promise<{
        avatarUrl: string;
        email: string;
        id: string;
        isOwner: boolean;
        login: string;
      }>;
      kv: {
        keys: () => Promise<string[]>;
        get: <T>(key: string) => Promise<T | undefined>;
        set: <T>(key: string, value: T) => Promise<void>;
        delete: (key: string) => Promise<void>;
      };
    };
  }
}

// Module declarations for external libraries
// Note: pdf-lib is properly installed as a dependency

// Font file imports
declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}