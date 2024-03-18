import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /threads", () => {
    it("should return response 401 when token is not provided", async () => {
      const server = await createServer(container);

      const payload = {
        title: "",
        body: "thread body content",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {},
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(401);
      expect(threadResponseJSON.message).toBe("Missing authentication");
    });

    it("should return response 400 when title is invalid", async () => {
      const server = await createServer(container);

      // * create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // * login
      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const authResponseJSON = JSON.parse(authResponse.payload);

      // * get token
      const token = authResponseJSON.data.accessToken;

      const payload = {
        title: "",
        body: "thread body content",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(400);
      expect(threadResponseJSON.status).toBe("fail");
      expect(threadResponseJSON.message).toBeDefined();
    });

    it("should return response 400 when body is invalid", async () => {
      const server = await createServer(container);

      // * create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // * login
      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const authResponseJSON = JSON.parse(authResponse.payload);

      // * get token
      const token = authResponseJSON.data.accessToken;

      const payload = {
        title: "thread title",
        body: "",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(400);
      expect(threadResponseJSON.status).toBe("fail");
      expect(threadResponseJSON.message).toBeDefined();
    });

    it("should return response 201 when payload is valid", async () => {
      const server = await createServer(container);

      // * create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // * login
      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const authResponseJSON = JSON.parse(authResponse.payload);

      // * get token
      const token = authResponseJSON.data.accessToken;

      const payload = {
        title: "thread title",
        body: "thread body content",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(201);
      expect(threadResponseJSON.data.addedThread).toBeDefined();
      expect(threadResponseJSON.data.addedThread.id).toBeDefined();
      expect(threadResponseJSON.data.addedThread.title).toBe(payload.title);
      expect(threadResponseJSON.data.addedThread.owner).toBeDefined();
    });
  });

  describe("GET /threads/{threadId}", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-1" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-1",
        user_id: "user-1",
        created_at: new Date().getTime(),
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        thread_id: "thread-1",
        user_id: "user-1",
        created_at: new Date().getTime(),
      });
    });

    it("should return error when thread is not found", async () => {
      const server = await createServer(container);

      const threadResponse = await server.inject({
        method: "GET",
        url: "/threads/thread-x",
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toBe(404);
      expect(threadResponseJSON.status).toBe("fail");
      expect(typeof threadResponseJSON.message).toBe("string");
    });

    it("should return response 200 and correct detail of the thread", async () => {
      const server = await createServer(container);

      const threadResponse = await server.inject({
        method: "GET",
        url: "/threads/thread-1",
      });

      const threadResponseJSON = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toBe(200);
      expect(threadResponseJSON.status).toBe("success");
      expect(threadResponseJSON.data.thread).toBeDefined();
      expect(threadResponseJSON.data.thread).toHaveProperty("username");
      expect(threadResponseJSON.data.thread).toHaveProperty("date");
      expect(threadResponseJSON.data.thread).toHaveProperty("comments");
    });
  });
});
