/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-1",
    content = "reply content",
    user_id = "user-1",
    comment_id = "comment-1",
    created_at = 1710039703717,
  }) {
    const query = {
      text: "INSERT INTO replies (id, content, user_id, comment_id, created_at) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, user_id, comment_id, created_at],
    };

    await pool.query(query);
  },

  async getReplies() {
    const query = {
      text: "SELECT id FROM replies",
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getReplyById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id=$1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

export default RepliesTableTestHelper;
