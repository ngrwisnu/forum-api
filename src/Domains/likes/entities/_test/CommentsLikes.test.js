import CommentsLikes from "../CommentsLikes";

describe("CommentsLikes entity", () => {
  it("should be able to transform the data type of count property to number", async () => {
    const data = [
      {
        comment_id: "comment-1",
        count: "2",
      },
      {
        comment_id: "comment-2",
        count: "3",
      },
    ];

    const res = new CommentsLikes(data).getResult();

    expect(res).toHaveLength(2);
    expect(res[0]).toHaveProperty("count", 2);
    expect(res[1]).toHaveProperty("count", 3);
    expect(res[0].count).not.toBeNaN();
    expect(res[1].count).not.toBeNaN();
  });
});
