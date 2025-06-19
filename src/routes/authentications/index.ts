import { betterAuthClient } from '../../integration/better-auth';
import { createUnsecureRoute } from '../middleware/session-middleware';

export const authenticationsRoute = createUnsecureRoute();

authenticationsRoute.use((context) => {
  return betterAuthClient.handler(context.req.raw);
});