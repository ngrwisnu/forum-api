/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const LikesTableTestHelper = {
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
