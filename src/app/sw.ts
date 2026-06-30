/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  RuntimeCaching,
} from "serwist";
import { Serwist, NetworkFirst, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching: RuntimeCaching[] = [
  // Custom handlers FIRST — Serwist is first-match-wins.
  // defaultCache has a catch-all "others" that would shadow these if placed first.
  {
    matcher: ({ request }) => request.destination === "document",
    handler: new NetworkFirst({
      cacheName: "html-pages-cache",
      networkTimeoutSeconds: 3,
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
  {
    // tRPC GET queries (if any use GET). httpBatchStreamLink uses POST,
    // which SWR cannot cache. Offline data comes from React Query cache
    // (networkMode: offlineFirst) + IndexedDB merge.
    matcher: ({ url, request }) =>
      url.pathname.startsWith("/api/trpc/") && request.method === "GET",
    handler: new StaleWhileRevalidate({
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
  // defaultCache LAST — static assets, RSC, fonts, images
  ...defaultCache,
];

// Precache all app routes + offline page at SW install so they're always
// available offline without requiring manual visit.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("html-pages-cache").then((cache) =>
      Promise.allSettled([
        "/",
        "/dashboard",
        "/pos",
        "/reports",
        "/products",
        "/settings",
        "/~offline",
      ].map((url) => cache.add(new Request(url, { cache: "reload" })))),
    ),
  );
});

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
