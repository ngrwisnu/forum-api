exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
      notNull: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users",
      notNull: true,
    },
    created_at: {
      type: "BIGINT",
      notNull: true,
      default: pgm.func("EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
