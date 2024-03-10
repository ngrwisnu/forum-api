import ThreadRepository from "../../Domains/threads/ThreadRepository.js";
import PostedThread from "../../Domains/threads/entities/PostedThread.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import GetThread from "../../Domains/threads/entities/getThread.js";

class ThreadRepositoryPostgre extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postThread(payload) {
    const { title, body, user_id, created_at } = payload;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, user_id, created_at",
      values: [id, title, body, user_id, created_at],
    };

    const result = await this._pool.query(query);

    return new PostedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread not found!");
    }

    return new GetThread({ ...result.rows[0] });
  }

  async isThreadExist(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread not found!");
    }
  }
}

export default ThreadRepositoryPostgre;
