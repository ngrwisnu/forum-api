import routes from "./routes.js";
import CommentsHandler from "./handler.js";

export default {
  name: "comments",
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
