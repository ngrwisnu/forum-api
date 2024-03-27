import pool from "../../database/postgres/pool";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper";
import LikeRepositoryPostgre from "../LikeRepositoryPostgre";
import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper";
import PostedCommentLike from "../../../Domains/likes/entities/PostedCommentLike";

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
});
