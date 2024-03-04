import "dotenv/config";
import createServer from "./Infrastructures/http/createServer.js";
import container from "./Infrastructures/container.js";

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
