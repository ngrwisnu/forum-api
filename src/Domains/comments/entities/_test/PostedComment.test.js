import PostedComment from "../PostedComment";

describe("PostedComment", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const payload = {
      id: "comment-1",
      content: "comment content",
      user_id: "user-1",
      thread_id: "thread-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    };

    const res = new PostedComment(payload);

    expect(res.id).toBe(payload.id);
    expect(res.content).toBe(payload.content);
    expect(res.owner).toBe(payload.user_id);
  });
});
