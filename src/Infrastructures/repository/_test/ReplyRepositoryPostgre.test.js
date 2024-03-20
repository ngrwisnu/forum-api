import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import pool from "../../database/postgres/pool";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper";
import PostReply from "../../../Domains/replies/entities/PostReply";
import ReplyRepositoryPostgre from "../ReplyRepositoryPostgre";
import PostedReply from "../../../Domains/replies/entities/PostedReply";
import GetReply from "../../../Domains/replies/entities/GetReply";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import InvariantError from "../../../Commons/exceptions/InvariantError";

describe("ReplyRepositoryPostgre", () => {
  beforeEach(async () => {
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
      user_id: "user-2",
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-1",
      user_id: "user-2",
      thread_id: "thread-1",
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

  describe("postReply", () => {
    it("should returns posted reply object correctly", async () => {
      const payload = {
        content: "reply content",
      };

      const mockTime = new Date();
      jest.spyOn(global, "Date").mockImplementation(() => mockTime);

      const postReplyPayload = new PostReply({
        content: payload.content,
        user_id: "user-2",
        comment_id: "comment-1",
        created_at: new Date().getTime(),
      });

      const fakeIdGenerator = () => "1";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      // * action
      const result = await replyRepositoryPostgre.postReply(postReplyPayload);

      // * assert
      expect(result).toHaveProperty("id", "reply-1");
      expect(result).toHaveProperty("content", payload.content);
      expect(result).toHaveProperty("owner", "user-2");
      expect(result).toStrictEqual(
        new PostedReply({
          id: "reply-1",
          content: payload.content,
          user_id: "user-2",
          comment_id: "comment-1",
          is_deleted: false,
          created_at: new Date(),
        })
      );

      const replies = await RepliesTableTestHelper.getReplies();

      expect(replies).toHaveLength(1);
    });
  });

  describe("getReplyById", () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({});
    });

    it("should throw error when reply is not found", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(replyRepositoryPostgre.getReplyById("reply-x")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return the correct object when reply is found", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await replyRepositoryPostgre.getReplyById("reply-1");

      expect(result).toStrictEqual(new GetReply(result));
      expect(result).toHaveProperty("id", "reply-1");
      expect(result).toHaveProperty("content", "reply content");
      expect(result).toHaveProperty("user_id", "user-1");
      expect(result).toHaveProperty("comment_id", "comment-1");
      expect(result).toHaveProperty("is_deleted", false);
      expect(result).toHaveProperty("created_at");
      expect(result.created_at).not.toBeNaN();
    });
  });

  describe("deleteReplyById", () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({});
    });

    it("should throw error when deleting process failed", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      await expect(
        replyRepositoryPostgre.deleteReplyById("reply-x")
      ).rejects.toThrow(InvariantError);
    });

    it("should be able to update the is_deleted property", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await replyRepositoryPostgre.deleteReplyById("reply-1");

      expect(result).toBe(1);
      expect(result).not.toBe(0);

      const reply = await RepliesTableTestHelper.getReplyById("reply-1");

      expect(reply).toHaveProperty("id", "reply-1");
      expect(reply).toHaveProperty("is_deleted", true);
    });
  });

  describe("isReplyExist", () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({});
    });

    it("should throw error when reply does not exist", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(replyRepositoryPostgre.isReplyExist("reply-x")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return nothing when reply does exist", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(() => replyRepositoryPostgre.isReplyExist("reply-1")).not.toThrow(
        NotFoundError
      );
    });
  });

  describe("repliesDetails", () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({});
    });

    it("should return list of replies and joined with table user", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await replyRepositoryPostgre.repliesDetails();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id", "reply-1");
      expect(result[0]).toHaveProperty("content", "reply content");
      expect(result[0]).toHaveProperty("is_deleted", false);
      expect(result[0]).toHaveProperty("comment_id", "comment-1");
      expect(result[0]).toHaveProperty("username", "dicoding");
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).not.toBeNaN();
    });
  });
});
