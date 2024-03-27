import LikeRepository from "../../Domains/likes/LikeRepository.js";
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
}

export default LikeRepositoryPostgre;
