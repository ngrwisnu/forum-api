import ThreadRepository from "../../Domains/threads/ThreadRepository.js";
import PostedThread from "../../Domains/threads/entities/PostedThread.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

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
      text: "SELECT threads.id, threads.title, threads.body, threads.created_at as date, users.username FROM threads LEFT JOIN users ON users.id = threads.user_id WHERE threads.id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);
    result.rows[0].date = new Date(+result.rows[0].date);

    const commentsQuery = {
      text: "SELECT comments.id, comments.content, comments.created_at as date, users.username FROM comments LEFT JOIN users ON users.id = comments.user_id WHERE comments.thread_id=$1 ORDER BY comments.created_at",
      values: [id],
    };

    const commentResult = await this._pool.query(commentsQuery);
    const comments = commentResult.rows.map((row) => ({
      ...row,
      date: new Date(+row.date),
    }));

    return {
      ...result.rows[0],
      comments,
    };
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
