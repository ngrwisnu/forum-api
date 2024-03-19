import GetThread from "../GetThread";

describe("GetThread entity", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "thread-1",
      title: "thread title",
      body: "thread body content",
      user_id: "user-1",
      created_at: new Date().getTime(),
    };

    const res = new GetThread(data);

    expect(res.id).toBe(data.id);
    expect(res.title).toBe(data.title);
    expect(res.body).toBe(data.body);
    expect(res.user_id).toBe(data.user_id);
    expect(res.created_at).toBe(new Date(data.created_at));
  });
});
