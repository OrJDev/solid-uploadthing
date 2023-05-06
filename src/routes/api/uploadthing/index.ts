import type { APIEvent } from "solid-start";
import { ourFileRouter } from "./core";
import { createNextRouteHandler } from "uploadthing/server";

const { POST: handler } = createNextRouteHandler({
  router: ourFileRouter,
});

export const POST = async (event: APIEvent) => {
  return await handler(event.request);
};
