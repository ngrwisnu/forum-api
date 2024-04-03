/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const LikesTableTestHelper = {
  async addLike({
    threadId = "thread-1",
    commentId = "comment-1",
    userId = "user-1",
    is_liked = true,
  }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING *",
      values: [threadId, userId, commentId, is_liked],
    };

    await pool.query(query);
  },

  async getLikes() {
    const query = {
      text: "SELECT * FROM likes",
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM likes WHERE 1=1");
  },
};

export default LikesTableTestHelper;
