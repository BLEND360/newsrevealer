declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STAGE: string;
    }
  }
}

export {};
