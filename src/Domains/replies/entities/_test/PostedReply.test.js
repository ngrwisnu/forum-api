import PostedReply from "../PostedReply";

describe("PostedReply", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const payload = {
      id: "reply-1",
      content: "reply content",
      user_id: "user-1",
      comment_id: "comment-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    };

    const res = new PostedReply(payload);

    expect(res.id).toBe(payload.id);
    expect(res.content).toBe(payload.content);
    expect(res.owner).toBe(payload.user_id);
  });
});
