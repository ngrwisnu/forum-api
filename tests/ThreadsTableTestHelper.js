/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-1",
    title = "thread title",
    body = "thread body",
    user_id = "user-1",
    created_at = 1710039703717,
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, user_id, created_at],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

export default ThreadsTableTestHelper;
