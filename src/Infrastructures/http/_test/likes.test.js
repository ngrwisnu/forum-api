import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper";

describe("/likes endpoint", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("PUT /threads/{threadId}/comments/{commentId}/likes", () => {
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

    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
    });

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

    it("should return response 404 when thread is not found", async () => {
      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-x/comments/comment-1/likes",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const likeResponseJSON = JSON.parse(likeResponse.payload);

      expect(likeResponse.statusCode).toBe(404);
      expect(likeResponseJSON.status).toBe("fail");
      expect(typeof likeResponseJSON.message).toBe("string");
    });

    it("should return response 404 when comment is not found", async () => {
      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-1/comments/comment-x/likes",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const likeResponseJSON = JSON.parse(likeResponse.payload);

      expect(likeResponse.statusCode).toBe(404);
      expect(likeResponseJSON.status).toBe("fail");
      expect(typeof likeResponseJSON.message).toBe("string");
    });

    it("should return response 200 when succeed to like comment for the first time", async () => {
      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-1/comments/comment-1/likes",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const likeResponseJSON = JSON.parse(likeResponse.payload);

      expect(likeResponse.statusCode).toBe(200);
      expect(likeResponseJSON.status).toBe("success");

      const likeAfter = await LikesTableTestHelper.getLikes();

      expect(likeAfter).toHaveLength(1);
      expect(likeAfter[0]).toHaveProperty("is_liked", true);
    });

    it("should return response 200 when succeed to like/dislike comment", async () => {
      const server = await createServer(container);

      // * first action of like a comment
      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-1/comments/comment-1/likes",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const likeResponseJSON = JSON.parse(likeResponse.payload);

      expect(likeResponse.statusCode).toBe(200);
      expect(likeResponseJSON.status).toBe("success");

      const firstLike = await LikesTableTestHelper.getLikes();

      expect(firstLike).toHaveLength(1);
      expect(firstLike[0]).toHaveProperty("is_liked", true);
      // * ---------------------------

      // * second action of like a comment
      const likeResponse2 = await server.inject({
        method: "PUT",
        url: "/threads/thread-1/comments/comment-1/likes",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const likeResponseJSON2 = JSON.parse(likeResponse2.payload);

      expect(likeResponse2.statusCode).toBe(200);
      expect(likeResponseJSON2.status).toBe("success");

      const secondLike = await LikesTableTestHelper.getLikes();

      expect(secondLike).toHaveLength(1);
      expect(secondLike[0]).toHaveProperty("is_liked", false);
      // * ---------------------------
    });
  });
});
