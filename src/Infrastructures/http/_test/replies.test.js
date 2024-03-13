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
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 400 when reply content is invalid", async () => {
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        content: "",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(400);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 404 when thread is not found", async () => {
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-x/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 404 when comment is not found", async () => {
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-x/replies",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 201 when meets all the requirements", async () => {
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        content: "reply content",
      };

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments/comment-1/replies",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(201);
      expect(replyResponseJSON.data.addedReply).toBeDefined();
      expect(replyResponseJSON.data.addedReply.id).toBeDefined();
      expect(replyResponseJSON.data.addedReply.content).toBe(payload.content);
      expect(replyResponseJSON.data.addedReply.owner).toBeDefined();
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    beforeEach(async () => {
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "stewie",
          password: "secret",
          fullname: "stewie griffin",
        },
      });

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
      expect(replyResponseJSON.status).toBe("fail");
      expect(replyResponseJSON.message).toBeDefined();
    });

    it("should return response 403 when user is unauthorized", async () => {
      const server = await createServer(container);

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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-1",
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toBe(403);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when thread is not found", async () => {
      const server = await createServer(container);

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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-x/comments/comment-1/replies/reply-1",
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when comment is not found", async () => {
      const server = await createServer(container);

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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-x/replies/reply-1",
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 404 when reply is not found", async () => {
      const server = await createServer(container);

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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-x",
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(404);
      expect(replyResponseJSON.status).toBe("fail");
      expect(typeof replyResponseJSON.message).toBe("string");
    });

    it("should return response 200 when succeed", async () => {
      const server = await createServer(container);

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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );
      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name
      );
      const user = await tokenManager.decodePayload(token[0].token);

      await RepliesTableTestHelper.addReply({
        id: "reply-2",
        user_id: user.id,
      });

      const replyResponse = await server.inject({
        method: "DELETE",
        url: "/threads/thread-1/comments/comment-1/replies/reply-2",
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const replyResponseJSON = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toBe(200);
      expect(replyResponseJSON.status).toBe("success");
    });
  });
});
