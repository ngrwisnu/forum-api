import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import InvariantError from "../../Commons/exceptions/InvariantError.js";
import ReplyRepository from "../../Domains/replies/ReplyRepository.js";
import PostedReply from "../../Domains/replies/entities/PostedReply.js";
import GetReply from "../../Domains/replies/entities/GetReply.js";

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
      text: "SELECT * FROM replies WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Reply not found!");
    }

    return new GetReply({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: "UPDATE replies SET is_deleted=$2 WHERE id=$1",
      values: [id, true],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Failed deleting the reply");
    }

    return result.rowCount;
  }

  async isReplyExist(id) {
    const query = {
      text: "SELECT id FROM replies WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Reply not found!");
    }
  }
}

export default ReplyRepositoryPostgre;
