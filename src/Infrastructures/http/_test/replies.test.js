import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import AuthenticationTokenManager from "../../../Applications/security/AuthenticationTokenManager";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper";

describe("/replies endpoint", () => {
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
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-1/replies",
        payload,
        headers: {},
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(401);
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 400 when reply content is invalid", async () => {
      const server = await createServer(container);

      const payload = {
        content: "",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(400);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 404 when thread is not found", async () => {
      const server = await createServer(container);

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-x/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 404 when comment is not found", async () => {
      const server = await createServer(container);

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-x/replies",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 201 when meets all the requirements", async () => {
      const server = await createServer(container);

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(201);
      expect(replyResponseJSON.data.addedReply).toBeDefined();
      expect(replyResponseJSON.data.addedReply.id).toBeDefined();
      expect(replyResponseJSON.data.addedReply.content).toBe(payload.content);
      expect(replyResponseJSON.data.addedReply.owner).toBeDefined();

      const replies = await RepliesTableTestHelper.getReplies();

      expect(replies).toHaveLength(1);
      expect(replies.length).not.toBeGreaterThan(1);
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({});
    });

    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-1",
        headers: {},
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(401);
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 403 when user is unauthorized", async () => {
      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toBe(403);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when thread is not found", async () => {
      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-x/comments/comment-1/replies/reply-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when comment is not found", async () => {
      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-x/replies/reply-1",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when reply is not found", async () => {
      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-x",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 200 when succeed", async () => {
      const server = await createServer(container);

      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name
      );

      const user = await tokenManager.decodePayload(token);

      await RepliesTableTestHelper.addReply({
        id: "reply-2",
        user_id: user.id,
      });

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-2",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(200);
      expect(replyResponseJSON.status).toBe("success");

      const replyAfter = await RepliesTableTestHelper.getReplyById("reply-2");

      expect(replyAfter).toHaveProperty("id", "reply-2");
      expect(replyAfter).toHaveProperty("is_deleted", true);
    });
  });
});
