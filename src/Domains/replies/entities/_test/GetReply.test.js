import GetReply from "../GetReply";

describe("GetReply", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "reply-1",
      content: "reply content",
      user_id: "user-1",
      comment_id: "comment-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    };

    const res = new GetReply(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe(data.content);
    expect(res.user_id).toBe(data.user_id);
    expect(res.comment_id).toBe(data.comment_id);
    expect(res.is_deleted).toBe(data.is_deleted);
    expect(res.created_at).toBe(new Date(+data.created_at));
  });
});
