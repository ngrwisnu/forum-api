import IncludeComment from "../IncludeComment";

describe("IncludeComment", () => {
  it("should create the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "comment-1",
      content: "comment content",
      username: "stewie",
      is_deleted: false,
      created_at: new Date().getTime(),
    };

    const res = new IncludeComment(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe(data.content);
    expect(res.username).toBe(data.username);
    expect(res.date).toBe(new Date(+data.created_at));
  });

  it("should create the correct object when comment has been deleted", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const data = {
      id: "comment-1",
      content: "comment content",
      username: "stewie",
      is_deleted: true,
      created_at: new Date().getTime(),
    };

    const res = new IncludeComment(data);

    expect(res.id).toBe(data.id);
    expect(res.content).toBe("**komentar telah dihapus**");
    expect(res.username).toBe(data.username);
    expect(res.date).toBe(new Date(+data.created_at));
  });
});
