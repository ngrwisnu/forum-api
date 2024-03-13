import IncludeReply from "../IncludeReply";

describe("IncludeReply", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "reply-1",
      content: "reply content",
      username: "stewie",
      is_deleted: false,
      date: new Date().getTime(),
    };

    const res = new IncludeReply(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe(data.content);
    expect(res.username).toBe(data.username);
    expect(res.date).toBe(new Date(+data.date));
  });

  it("should create the correct object when reply has been deleted", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "reply-1",
      content: "reply content",
      username: "stewie",
      is_deleted: true,
      date: new Date().getTime(),
    };

    const res = new IncludeReply(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe("**balasan telah dihapus**");
    expect(res.username).toBe(data.username);
    expect(res.date).toBe(new Date(+data.date));
  });
});
