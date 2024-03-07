import pool from "../src/Infrastructures/database/postgres/pool.js";

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

export default ThreadsTableTestHelper;
