import routes from "./routes.js";
import CommentHandler from "./handler.js";

export default {
  name: "comments",
  register: async (server, { container }) => {
    const commentsHandler = new CommentHandler(container);
    server.route(routes(commentsHandler));
  },
};
