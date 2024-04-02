import InvariantError from "../../Commons/exceptions/InvariantError.js";
import LikeRepository from "../../Domains/likes/LikeRepository.js";
import CommentsLikes from "../../Domains/likes/entities/CommentsLikes.js";
import PostedCommentLike from "../../Domains/likes/entities/PostedCommentLike.js";

class LikeRepositoryPostgre extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async postCommentLike(threadId, commentId, userId) {
    const query = {
      text: "INSERT INTO likes(thread_id, comment_id, user_id) VALUES($1, $2, $3) RETURNING *",
      values: [threadId, commentId, userId],
    };

    const result = await this._pool.query(query);

    return new PostedCommentLike(result.rows[0]);
  }

  async getCommentsLikesByThreadId(threadId) {
    const query = {
      text: "SELECT COUNT(user_id), comment_id FROM likes WHERE thread_id=$1 AND is_liked=$2 GROUP BY comment_id",
      values: [threadId, true],
    };

    const result = await this._pool.query(query);

    return new CommentsLikes(result.rows).getResult();
  }

  async isCommentLikedByUser(userId, commentId) {
    const query = {
      text: "SELECT is_liked FROM likes WHERE user_id=$1 AND comment_id=$2",
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async updateCommentLike(userId, commentId, current) {
    const query = {
      text: "UPDATE likes SET is_liked=$3 WHERE user_id=$1 AND comment_id=$2",
      values: [userId, commentId, !current],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Failed updating the like status");
    }

    return result.rowCount;
  }
}

export default LikeRepositoryPostgre;
