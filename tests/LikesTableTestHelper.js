/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const LikesTableTestHelper = {
  async postLike(
    threadId = "thread-1",
    commentId = "comment-1",
    userId = "user-1"
  ) {
    const query = {
      text: "INSERT INTO likes(thread_id, comment_id, user_id) VALUES($1, $2, $3) RETURNING *",
      values: [threadId, commentId, userId],
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
