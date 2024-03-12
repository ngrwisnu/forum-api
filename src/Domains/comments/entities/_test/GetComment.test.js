import GetComment from "../GetComment";

describe("GetComment", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "comment-1",
      content: "comment content",
      user_id: "user-1",
      thread_id: "thread-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    };

    const res = new GetComment(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe(data.content);
    expect(res.user_id).toBe(data.user_id);
    expect(res.thread_id).toBe(data.thread_id);
    expect(res.is_deleted).toBe(data.is_deleted);
    expect(res.created_at).toBe(new Date(data.created_at));
  });
});
