import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import ThreadRepository from "../../Domains/threads/ThreadRepository.js";
import PostedThread from "../../Domains/threads/entities/PostedThread.js";

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

    return new PostedThread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.created_at as date, users.username FROM threads LEFT JOIN users ON users.id = threads.user_id WHERE threads.id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async isThreadExist(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("thread not found");
  }
}

export default ThreadRepositoryPostgre;
