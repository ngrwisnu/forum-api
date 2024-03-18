import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import PostThread from "../../../Domains/threads/entities/PostThread";
import PostedThread from "../../../Domains/threads/entities/PostedThread";
import pool from "../../database/postgres/pool";
import ThreadRepositoryPostgre from "../ThreadRepositoryPostgre";

describe("ThreadRepositoryPostgre", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-1",
      username: "stewie",
      password: "secret",
      fullname: "stewie griffin",
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("postThread", () => {
    it("should return posted thread correctly", async () => {
      const payload = {
        title: "thread title",
        body: "thread body content",
      };

      const mockTime = new Date();
      jest.spyOn(global, "Date").mockImplementation(() => mockTime);

      const postThreadPayload = new PostThread({
        title: payload.title,
        body: payload.body,
        user_id: "user-1",
        created_at: new Date().getTime(),
      });

      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      // * action
      const result = await threadRepositoryPostgre.postThread(
        postThreadPayload
      );

      // * assert
      expect(result).toHaveProperty("id", "thread-10");
      expect(result).toHaveProperty("title", payload.title);
      expect(result).toHaveProperty("body", payload.body);
      expect(result).toHaveProperty("owner", "user-1");
      expect(result).toHaveProperty("created_at");
      expect(result).toStrictEqual(
        new PostedThread({
          id: "thread-10",
          title: payload.title,
          body: payload.body,
          user_id: "user-1",
          created_at: new Date(),
        })
      );

      const threads = await ThreadsTableTestHelper.getThreads();

      expect(threads).toHaveLength(1);
      expect(threads.length).not.toBeGreaterThan(1);
    });
  });

  describe("getThreadById", () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({});
    });

    it("should throw error when thread with specific id is not found", async () => {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await threadRepositoryPostgre.getThreadById("thread-x");

      expect(result).toBe(undefined);
    });

    it("should return the object correctly when thread is found", async () => {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await threadRepositoryPostgre.getThreadById("thread-1");

      expect(result).toHaveProperty("id", "thread-1");
      expect(result).toHaveProperty("title", "thread title");
      expect(result).toHaveProperty("body", "thread body");
      expect(result).toHaveProperty("date");
      expect(result.date).not.toBeNaN();
      expect(result).toHaveProperty("username", "stewie");
    });
  });

  describe("isThreadExist", () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({});
    });

    it("should throw error when thread is not exist in the database", async () => {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(threadRepositoryPostgre.isThreadExist("thread-x")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return nothing when thread is found in the database", async () => {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await threadRepositoryPostgre.isThreadExist("thread-1");

      expect(result).toBeUndefined();
    });
  });
});
