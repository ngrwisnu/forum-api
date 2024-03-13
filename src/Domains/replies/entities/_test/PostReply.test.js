import PostReply from "../PostReply";

describe("PostReply", () => {
  it("should create the correct object", async () => {
    const payload = {
      content: "reply content",
      user_id: "user-1",
      comment_id: "comment-1",
      created_at: 100,
    };

    const res = new PostReply(payload);

    expect(res.content).toBe(payload.content);
    expect(res.user_id).toBe(payload.user_id);
    expect(res.comment_id).toBe(payload.comment_id);
    expect(res.created_at).toBe(payload.created_at);
  });
});
