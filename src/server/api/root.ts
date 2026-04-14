import "server-only";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import {
  categoryRouter,
  productRouter,
  storeRouter,
  transactionRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  transaction: transactionRouter,
  category: categoryRouter,
  store: storeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
