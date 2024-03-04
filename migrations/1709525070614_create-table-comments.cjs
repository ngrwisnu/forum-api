exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      references: "threads",
      notNull: true,
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: "FALSE",
    },
    created_at: {
      type: "BIGINT",
      notNull: true,
      default: pgm.func("EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
