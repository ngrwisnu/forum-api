/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-1",
    content = "comment content",
    user_id = "user-1",
    thread_id = "thread-1",
    created_at = 1710039703717,
  }) {
    const query = {
      text: "INSERT INTO comments (id, content, user_id, thread_id, created_at) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, user_id, thread_id, created_at],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

export default CommentsTableTestHelper;
