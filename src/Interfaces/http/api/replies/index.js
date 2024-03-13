import routes from "./routes.js";
import RepliesHandler from "./handler.js";

export default {
  name: "replies",
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};
