import container from "../../container";
import createServer from "../createServer";

describe("/likes endpoint", () => {
  describe("PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-1/comments/comment-1/likes",
        headers: {},
      });

      const likeResponseJSON = JSON.parse(likeResponse.payload);
      expect(likeResponse.statusCode).toEqual(401);
      expect(likeResponseJSON.message).toBeDefined();
    });
  });
});
