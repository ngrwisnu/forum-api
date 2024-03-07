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

    return new PostedThread({ ...result.rows[0] });
  }
}

export default ThreadRepositoryPostgre;
