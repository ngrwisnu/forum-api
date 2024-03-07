import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
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
      expect(threadResponseJSON.status).toBe("fail");
      expect(threadResponseJSON.message).toBeDefined();
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        title: "",
        body: "thread body content",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        title: "thread title",
        body: "",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
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
      const token = await AuthenticationsTableTestHelper.findToken(
        authResponseJSON.data.refreshToken
      );

      const payload = {
        title: "thread title",
        body: "thread body content",
      };

      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload,
        headers: {
          authorization: `Bearer ${token[0].token}`,
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
});
