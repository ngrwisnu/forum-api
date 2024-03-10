import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";

describe("/comments endpoint", () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();

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
      expect(commentResponseJSON.status).toBe("fail");
      expect(commentResponseJSON.message).toBeDefined();
    });

    it("should return response 400 when comment content is invalid", async () => {
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

      const commentResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
        },
      });

      const commentResponseJSON = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(400);
      expect(commentResponseJSON.status).toBe("fail");
      expect(commentResponseJSON.message).toBeDefined();
    });

    it("should return response 201 when payload is valid", async () => {
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
        content: "comment content",
      };

      const commentResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-1/comments",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
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
    });
  });
});
