import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import AuthenticationTokenManager from "../../../Applications/security/AuthenticationTokenManager";

describe("/comments endpoint", () => {
  let token;

  beforeEach(async () => {
    const server = await createServer(container);

    // * create user
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "stewie",
        password: "secret",
        fullname: "stewie griffin",
      },
    });

    // * login
    const authResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "stewie",
        password: "secret",
      },
    });

    const authResponseJSON = JSON.parse(authResponse.payload);

    // * get token
    token = authResponseJSON.data.accessToken;
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-1",
    });
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /threads/{threadId}/comments", () => {
    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const payload = {
        content: "comment content",
      };

      const commentResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments",
        payload,
        headers: {},
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(401);
      expect(commentResponseJSON.message).toBeDefined();
    });

    it("should return response 400 when comment content is invalid", async () => {
      const server = await createServer(container);

      const payload = {
        content: "",
      };

      const commentResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);

      expect(commentResponse.statusCode).toEqual(400);
      expect(commentResponseJSON.status).toBe("fail");
      expect(commentResponseJSON.message).toBeDefined();
    });

    it("should return response 201 when payload is valid", async () => {
      const server = await createServer(container);

      const payload = {
        content: "comment content",
      };

      const commentResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(201);
      expect(commentResponseJSON.data.addedComment).toBeDefined();
      expect(commentResponseJSON.data.addedComment.id).toBeDefined();
      expect(commentResponseJSON.data.addedComment.content).toBe(
        payload.content
      );
      expect(commentResponseJSON.data.addedComment.owner).toBeDefined();

      const comments = await CommentsTableTestHelper.getComments();

      expect(comments).toHaveLength(1);
      expect(comments.length).not.toBeGreaterThan(1);
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const commentResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1",
        headers: {},
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(401);
      expect(commentResponseJSON.message).toBeDefined();
    });

    it("should return response 403 when user is unauthorized", async () => {
      const server = await createServer(container);

      // * create comment
      await CommentsTableTestHelper.addComment({
        user_id: "user-1",
        thread_id: "thread-1",
      });

      const commentResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);

      expect(commentResponse.statusCode).toBe(403);
      expect(commentResponseJSON.status).toBe("fail");
      expect(typeof commentResponseJSON.message).toBe("string");
    });

    it("should return response 404 when thread is not found", async () => {
      const server = await createServer(container);

      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name
      );

      const user = await tokenManager.decodePayload(token);

      // * create comment
      await CommentsTableTestHelper.addComment({
        user_id: user.id,
        thread_id: "thread-1",
      });

      const commentResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-100/comments/comment-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);

      expect(commentResponse.statusCode).toBe(404);
      expect(commentResponseJSON.status).toBe("fail");
      expect(typeof commentResponseJSON.message).toBe("string");
    });

    it("should return response 404 when comment is not found", async () => {
      const server = await createServer(container);

      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name
      );

      const user = await tokenManager.decodePayload(token);

      // * create comment
      await CommentsTableTestHelper.addComment({
        user_id: user.id,
        thread_id: "thread-1",
      });

      const commentResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-100",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);

      expect(commentResponse.statusCode).toBe(404);
      expect(commentResponseJSON.status).toBe("fail");
      expect(typeof commentResponseJSON.message).toBe("string");
    });

    it("should return response 200 when succeed", async () => {
      const server = await createServer(container);

      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name
      );
      const user = await tokenManager.decodePayload(token);

      // * create comment
      await CommentsTableTestHelper.addComment({
        user_id: user.id,
        thread_id: "thread-1",
      });

      const commentResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);

      expect(commentResponse.statusCode).toBe(200);
      expect(commentResponseJSON.status).toBe("success");

      const commentAfter = await CommentsTableTestHelper.getCommentById(
        "comment-1"
      );

      expect(commentAfter).toHaveProperty("id", "comment-1");
      expect(commentAfter).toHaveProperty("is_deleted", true);
    });
  });
});
