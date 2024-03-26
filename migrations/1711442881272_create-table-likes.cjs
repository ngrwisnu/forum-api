exports.up = (pgm) => {
  pgm.createTable("likes", {
    thread_id: {
      type: "VARCHAR(50)",
      references: "threads",
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
    is_liked: {
      type: "BOOLEAN",
      notNull: true,
      default: "TRUE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("likes");
};
