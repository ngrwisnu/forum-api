import pool from "../../database/postgres/pool";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import LikeRepositoryPostgre from "../LikeRepositoryPostgre";
import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper";
import PostedCommentLike from "../../../Domains/likes/entities/PostedCommentLike";
import InvariantError from "../../../Commons/exceptions/InvariantError";

describe("LikeRepositoryPostgre", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("postCommentLike", () => {
    it("should return correct object of PostedCommentLike", async () => {
      const likeRepositoryPostgre = new LikeRepositoryPostgre(pool);

      const result = await likeRepositoryPostgre.postCommentLike(
        "thread-1",
        "comment-1",
        "user-1"
      );

      expect(result).toStrictEqual(new PostedCommentLike(result));

      const likes = await LikesTableTestHelper.getLikes();

      expect(likes).toHaveLength(1);
    });
  });

  describe("isCommentLikedByUser", () => {
    beforeEach(async () => {
      await LikesTableTestHelper.postLike();
    });

    it("should return comment's like status", async () => {
      const likeRepositoryPostgre = new LikeRepositoryPostgre(pool);

      const result = await likeRepositoryPostgre.isCommentLikedByUser(
        "user-1",
        "comment-1"
      );

      expect(result).toStrictEqual({ is_liked: true });
    });
  });

  describe("updateCommentLike", () => {
    beforeEach(async () => {
      await LikesTableTestHelper.postLike();
    });

    it("should throw error when updating process failed", async () => {
      const likeRepositoryPostgre = new LikeRepositoryPostgre(pool);

      expect(
        likeRepositoryPostgre.updateCommentLike("user-1", "comment-x", true)
      ).rejects.toThrow(InvariantError);
    });

    it("should be able to update the is_liked status", async () => {
      const likeRepositoryPostgre = new LikeRepositoryPostgre(pool);

      const result = await likeRepositoryPostgre.updateCommentLike(
        "user-1",
        "comment-1",
        true
      );

      expect(result).toBe(1);

      const likes = await LikesTableTestHelper.getLikes();

      expect(likes).toHaveLength(1);
      expect(likes[0]).toHaveProperty("is_liked", false);
    });
  });
});
