import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import PostThread from "../../../Domains/threads/entities/PostThread";
import PostedThread from "../../../Domains/threads/entities/PostedThread";
import GetThread from "../../../Domains/threads/entities/getThread";
import pool from "../../database/postgres/pool";
import ThreadRepositoryPostgre from "../ThreadRepositoryPostgre";

describe("ThreadRepositoryPostgre", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-1",
      username: "stewie",
      password: "secret",
      fullname: "stewie griffin",
    });

    await ThreadsTableTestHelper.addThread({});
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it("should returns posted thread correctly", async () => {
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
    const result = await threadRepositoryPostgre.postThread(postThreadPayload);

    // * assert
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("body");
    expect(result).toHaveProperty("owner");
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
  });

  it("should throw error when thread with specific id is not found", async () => {
    try {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgre.getThreadById("thread-123");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should return the object correctly when thread is found", async () => {
    const fakeIdGenerator = () => "10";

    const threadRepositoryPostgre = new ThreadRepositoryPostgre(
      pool,
      fakeIdGenerator
    );

    const result = await threadRepositoryPostgre.getThreadById("thread-1");

    expect(result).toStrictEqual(new GetThread(result));
  });

  it("should throw error when thread is not exist in the database", async () => {
    try {
      const fakeIdGenerator = () => "10";

      const threadRepositoryPostgre = new ThreadRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgre.isThreadExist("thread-123");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
