/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query";

export {}

declare global {
  interface Global {
    queryClient: QueryClient;
  }

  // Adiciona a propriedade ao globalThis
  var queryClient: QueryClient;
}