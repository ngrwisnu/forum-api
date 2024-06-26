import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import PostedComment from "../../../Domains/comments/entities/PostedComment";
import PostComment from "../../../Domains/comments/entities/PostComment";
import pool from "../../database/postgres/pool";
import CommentRepositoryPostgre from "../CommentRepositoryPostgre";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import GetComment from "../../../Domains/comments/entities/GetComment";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import InvariantError from "../../../Commons/exceptions/InvariantError";

describe("CommentRepositoryPostgre", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await UsersTableTestHelper.addUser({
      id: "user-2",
      username: "stewie",
      password: "secret",
      fullname: "stewie griffin",
    });
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("postComment", () => {
    it("should return posted thread correctly", async () => {
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
      expect(result).toHaveProperty("id", "comment-10");
      expect(result).toHaveProperty("content", payload.content);
      expect(result).toHaveProperty("owner", "user-2");
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

      const comments = await CommentsTableTestHelper.getComments();

      expect(comments).toHaveLength(2);
    });
  });

  describe("getCommentById", () => {
    it("should throw error when comment is not found", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgre.getCommentById("comment-x")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return the correct object when comment is found", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.getCommentById("comment-1");

      expect(result).toStrictEqual(new GetComment(result));
      expect(result).toHaveProperty("id", "comment-1");
      expect(result).toHaveProperty("content", "comment content");
      expect(result).toHaveProperty("user_id", "user-1");
      expect(result).toHaveProperty("thread_id", "thread-1");
      expect(result).toHaveProperty("is_deleted", false);
      expect(result).toHaveProperty("created_at");
      expect(result.date).not.toBeNaN();
    });
  });

  describe("deleteCommentById", () => {
    it("should throw error when updating process failed", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      await expect(
        commentRepositoryPostgre.deleteCommentById("comment-x")
      ).rejects.toThrow(InvariantError);
    });

    it("should be able to update the is_deleted property", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.deleteCommentById(
        "comment-1"
      );

      expect(result).toBe(1);
      expect(result).not.toBe(0);

      const comment = await CommentsTableTestHelper.getCommentById("comment-1");

      expect(comment).toHaveProperty("id", "comment-1");
      expect(comment).toHaveProperty("is_deleted", true);
      expect(comment).not.toHaveProperty("is_deleted", false);
    });
  });

  describe("isCommentExist", () => {
    it("should throw not found error when comment does not exist", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgre.isCommentExist("comment-x")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return nothing when comment does exist", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(() =>
        commentRepositoryPostgre.isCommentExist("comment-1")
      ).not.toThrow(NotFoundError);
    });
  });

  describe("threadsCommentsDetails", () => {
    beforeAll(async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        created_at: new Date().getTime(),
      });
    });

    it("should return comments list of a thread", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.threadsCommentsDetails(
        "thread-1"
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("id", "comment-1");
      expect(result[0]).toHaveProperty("content", "comment content");
      expect(result[0]).toHaveProperty("date");
      expect(result[0].date).not.toBeNaN();
      expect(result[0]).toHaveProperty("is_deleted");
      expect(result[0]).toHaveProperty("username", "dicoding");
    });

    it("should return empty array when a thread does not have any comments", async () => {
      const fakeIdGenerator = () => "10";

      const commentRepositoryPostgre = new CommentRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await commentRepositoryPostgre.threadsCommentsDetails(
        "thread-x"
      );

      expect(result).toHaveLength(0);
      expect(result).not.toHaveLength(2);
    });
  });
});
