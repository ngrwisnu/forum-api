import PostComment from "../PostComment";

describe("PostComment", () => {
  it("should create the correct object", async () => {
    const payload = {
      content: "comment content",
      user_id: "user-1",
      thread_id: "thread-1",
      created_at: 100,
    };

    const res = new PostComment(payload);

    expect(res.content).toBe(payload.content);
    expect(res.user_id).toBe(payload.user_id);
    expect(res.thread_id).toBe(payload.thread_id);
    expect(res.created_at).toBe(payload.created_at);
  });
});
