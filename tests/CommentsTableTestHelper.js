/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-1",
    content = "comment content",
    user_id = "user-1",
    thread_id = "thread-1",
    is_deleted = false,
    created_at = 1710039703717,
  }) {
    const query = {
      text: "INSERT INTO comments (id, content, user_id, thread_id, is_deleted, created_at) VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, content, user_id, thread_id, is_deleted, created_at],
    };

    await pool.query(query);
  },

  async getComments() {
    const query = {
      text: "SELECT id FROM comments",
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id=$1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

export default CommentsTableTestHelper;
