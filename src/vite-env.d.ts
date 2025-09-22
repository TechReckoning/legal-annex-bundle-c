/// <reference types="vite/client" />

declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Add missing type declarations
type NoInfer<T> = [T][T extends any ? 0 : never];