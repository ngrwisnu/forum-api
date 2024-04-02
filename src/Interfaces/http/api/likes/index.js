import routes from "./routes.js";
import LikesHandler from "./handler.js";

export default {
  name: "likes",
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);
    server.route(routes(likesHandler));
  },
};
