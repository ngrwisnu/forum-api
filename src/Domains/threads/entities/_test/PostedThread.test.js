import PostedThread from "../PostedThread.js";

describe("PostedThread entity", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const payload = {
      id: "thread-1",
      title: "thread title",
      body: "thread body content",
      user_id: "user-1",
      created_at: new Date().getTime(),
    };

    const res = new PostedThread(payload);

    expect(res.id).toBe(payload.id);
    expect(res.title).toBe(payload.title);
    expect(res.body).toBe(payload.body);
    expect(res.owner).toBe(payload.user_id);
    expect(res.created_at).toBe(new Date(payload.created_at));
  });
});
