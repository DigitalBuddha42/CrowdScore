import { createTRPCRouter, createCallerFactory } from './trpc';
import { fightsRouter } from './routers/fights';
import { scorecardsRouter } from './routers/scorecards';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  fights: fightsRouter,
  scorecards: scorecardsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
