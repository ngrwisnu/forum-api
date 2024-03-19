import PostThread from "../PostThread.js";

describe("PostThread entity", () => {
  it("should create the correct object", async () => {
    const payload = {
      title: "thread title",
      body: "thread body content",
      user_id: "user-1",
      created_at: 100,
    };

    const res = new PostThread(payload);

    expect(res.title).toBe(payload.title);
    expect(res.body).toBe(payload.body);
    expect(res.user_id).toBe(payload.user_id);
    expect(res.created_at).toBe(payload.created_at);
  });
});
