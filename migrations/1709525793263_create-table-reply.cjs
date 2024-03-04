exports.up = (pgm) => {
  pgm.createTable("replies", {
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
    comment_id: {
      type: "VARCHAR(50)",
      references: "comments",
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
  pgm.dropTable("replies");
};
