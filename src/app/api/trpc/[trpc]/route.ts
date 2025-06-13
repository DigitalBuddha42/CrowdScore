import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';

import { appRouter } from '@/lib/api/root';
import { createTRPCContext } from '@/lib/api/trpc';

const env = process.env;

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : ({ path, error }) => {
            console.error(`tRPC failed on ${path ?? '<no-path>'}`, error);
          },
  });

export { handler as GET, handler as POST };
