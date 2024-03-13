import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import InvariantError from "../../Commons/exceptions/InvariantError.js";
import GetComment from "../../Domains/comments/entities/GetComment.js";
import ReplyRepository from "../../Domains/replies/ReplyRepository.js";
import PostedReply from "../../Domains/replies/entities/PostedReply.js";

class ReplyRepositoryPostgre extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postReply(payload) {
    const { content, user_id, comment_id, created_at } = payload;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies (id, content, user_id, comment_id, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *",
      values: [id, content, user_id, comment_id, created_at],
    };

    const result = await this._pool.query(query);

    return new PostedReply({ ...result.rows[0] });
  }

  async getReplyById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Comment not found!");
    }

    return new GetComment({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: "UPDATE comments SET is_deleted=$2 WHERE id=$1",
      values: [id, true],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new InvariantError("Failed updating the comment");
    }

    return result.rowCount;
  }

  async isReplyExist(id) {
    const query = {
      text: "SELECT id FROM comments WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Comment not found!");
    }
  }
}

export default ReplyRepositoryPostgre;
