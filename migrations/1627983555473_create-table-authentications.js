/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("authentications", {
    token: {
      type: "TEXT",
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("authentications");
};
