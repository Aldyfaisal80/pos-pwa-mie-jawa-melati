/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  RuntimeCaching,
} from "serwist";
import { Serwist, NetworkFirst } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching: RuntimeCaching[] = [
  ...defaultCache,
  // Cache HTML Pages explicitly so they load instantly when offline
  {
    matcher: ({ request }) => request.destination === "document",
    handler: new NetworkFirst({
      cacheName: "html-pages-cache",
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            if (response && response.status === 200) {
              return response;
            }
            return null;
          },
        },
      ],
    }),
  },
  // Cache all tRPC Data 
  {
    matcher: ({ url }) => url.pathname.startsWith("/api/trpc/"),
    handler: new NetworkFirst({
      cacheName: "trpc-api-cache",
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            if (response && response.status === 200) {
              return response;
            }
            return null;
          },
        },
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
