import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import PostedComment from "../../../Domains/comments/entities/PostedComment";
import PostComment from "../../../Domains/comments/entities/PostComment";
import pool from "../../database/postgres/pool";
import CommentRepositoryPostgre from "../CommentRepositoryPostgre";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import GetComment from "../../../Domains/comments/entities/GetComment";

describe("CommentRepositoryPostgre", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-1",
    });
    await UsersTableTestHelper.addUser({
      id: "user-2",
      username: "stewie",
      password: "secret",
      fullname: "stewie griffin",
    });
    await ThreadsTableTestHelper.addThread({
      id: "thread-1",
    });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("postComment", () => {
    it("should returns posted thread correctly", async () => {
      const payload = {
        content: "comment content",
      };

      const mockTime = new Date();
      jest.spyOn(global, "Date").mockImplementation(() => mockTime);

      const postCommentPayload = new PostComment({
        content: payload.content,
        user_id: "user-2",
        thread_id: "thread-1",
        created_at: new Date().getTime(),
      });

      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      // * action
      const result = await commentRepositoryPostgre.postComment(
        postCommentPayload
      );

      // * assert
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("owner");
      expect(result).toStrictEqual(
        new PostedComment({
          id: "comment-10",
          content: payload.content,
          user_id: "user-2",
          thread_id: "thread-1",
          is_deleted: false,
          created_at: new Date(),
        })
      );
    });
  });

  describe("getCommentById", () => {
    it("should return 404 when comment is not found", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgre.getCommentById("comment-1")
      ).rejects.toThrow();
    });

    it("should return the correct object when comment is found", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.getCommentById(
        "comment-10"
      );

      expect(result).toStrictEqual(new GetComment(result));
    });
  });

  describe("deleteCommentById", () => {
    it("should return error when updating process failed", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );
      commentRepositoryPostgre.deleteCommentById = jest
        .fn()
        .mockImplementation(() => Promise.reject("updating failed"));

      await expect(
        commentRepositoryPostgre.deleteCommentById("comment-10")
      ).rejects.toBe("updating failed");
    });

    it("should be able to update the is_deleted property", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.deleteCommentById(
        "comment-10"
      );

      expect(result).toBe(1);
    });
  });

  describe("isCommentExist", () => {
    it("should return 404 when comment does not exist", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgre.isCommentExist("comment-1")
      ).rejects.toThrow();
    });
  });
});
