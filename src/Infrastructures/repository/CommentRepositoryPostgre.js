import CommentRepository from "../../Domains/comments/CommentRepository.js";
import PostedComment from "../../Domains/comments/entities/PostedComment.js";

class CommentRepositoryPostgre extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postComment(payload) {
    const { content, user_id, thread_id, created_at } = payload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments (id, content, user_id, thread_id, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *",
      values: [id, content, user_id, thread_id, created_at],
    };

    const result = await this._pool.query(query);

    return new PostedComment({ ...result.rows[0] });
  }
}

export default CommentRepositoryPostgre;
