import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import pool from "../../database/postgres/pool";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper";
import PostReply from "../../../Domains/replies/entities/PostReply";
import ReplyRepositoryPostgre from "../ReplyRepositoryPostgre";
import PostedReply from "../../../Domains/replies/entities/PostedReply";
import GetReply from "../../../Domains/replies/entities/GetReply";

describe("ReplyRepositoryPostgre", () => {
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
      user_id: "user-2",
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-1",
      user_id: "user-2",
      thread_id: "thread-1",
    });
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
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
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("owner");
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
    });
  });

  describe("getReplyById", () => {
    it("should return 404 when reply is not found", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(replyRepositoryPostgre.getReplyById("reply-x")).rejects.toThrow();
    });

    it("should return the correct object when reply is found", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await replyRepositoryPostgre.getReplyById("reply-1");

      expect(result).toStrictEqual(new GetReply(result));
    });
  });

  describe("deleteReplyById", () => {
    it("should return error when deleting process failed", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      await expect(
        replyRepositoryPostgre.deleteReplyById("reply-x")
      ).rejects.toThrow();
    });

    it("should be able to update the is_deleted property", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      const result = await replyRepositoryPostgre.deleteReplyById("reply-1");

      expect(result).toBe(1);
    });
  });

  describe("isReplyExist", () => {
    it("should return 404 when reply does not exist", async () => {
      const fakeIdGenerator = () => "10";

      const replyRepositoryPostgre = new ReplyRepositoryPostgre(
        pool,
        fakeIdGenerator
      );

      expect(
        replyRepositoryPostgre.isReplyExist("comment-x")
      ).rejects.toThrow();
    });
  });
});
