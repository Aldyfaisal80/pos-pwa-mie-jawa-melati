import {
  defaultShouldDehydrateQuery,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // Global handler: redirect to login on UNAUTHORIZED tRPC errors
        // This catches cases where the session expired but AuthProvider
        // hasn't detected it yet (e.g., background tRPC calls)
        if (
          typeof window !== "undefined" &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "code" in error.data &&
          error.data.code === "UNAUTHORIZED" &&
          !window.location.pathname.startsWith("/login")
        ) {
          const redirect = encodeURIComponent(window.location.pathname);
          window.location.replace(`/login?redirect=${redirect}`);
        }
      },
    }),
    defaultOptions: {
      queries: {
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        networkMode: "always", // Delegating offline capability to Service Worker
        retry: (failureCount, error) => {
          // Don't retry UNAUTHORIZED errors — session is dead
          if (
            "data" in error &&
            typeof error.data === "object" &&
            error.data !== null &&
            "code" in error.data &&
            error.data.code === "UNAUTHORIZED"
          ) {
            return false;
          }
          return failureCount < 3;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
