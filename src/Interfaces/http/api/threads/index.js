import routes from "./routes.js";
import ThreadsHandler from "./handler.js";

export default {
  name: "threads",
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};
