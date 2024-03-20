import ThreadDetails from "../ThreadDetails";

describe("ThreadDetails", () => {
  it("should return the correct object", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const thread = {
      id: "thread-1",
      title: "a title",
      body: "a body",
      date: new Date().getTime(),
      username: "stewie",
    };

    const comments = [
      {
        id: "comment-1",
        content: "a content",
        date: new Date().getTime(),
        username: "peter",
        is_deleted: false,
      },
    ];

    const replies = [
      {
        id: "reply-1",
        content: "a content",
        date: new Date().getTime(),
        username: "stewie",
        is_deleted: false,
        comment_id: "comment-1",
      },
    ];

    const result = new ThreadDetails(thread, comments, replies);

    console.log(result);
    expect(result.id).toBe(thread.id);
    expect(result.title).toBe(thread.title);
    expect(result.body).toBe(thread.body);
    expect(result.username).toBe(thread.username);
    expect(result.date).toBe(new Date(+thread.date));
    expect(result.comments.length).toBe(1);
    expect(result.comments[0].replies.length).toBe(1);
  });

  it("should return the correct object with deleted content", async () => {
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const thread = {
      id: "thread-1",
      title: "a title",
      body: "a body",
      date: new Date().getTime(),
      username: "stewie",
    };

    const comments = [
      {
        id: "comment-1",
        content: "a content",
        date: new Date().getTime(),
        username: "peter",
        is_deleted: true,
      },
    ];

    const replies = [
      {
        id: "reply-1",
        content: "a content",
        date: new Date().getTime(),
        username: "stewie",
        is_deleted: true,
        comment_id: "comment-1",
      },
      {
        id: "reply-2",
        content: "a content",
        date: new Date().getTime(),
        username: "stewie",
        is_deleted: true,
        comment_id: "comment-2",
      },
    ];

    const result = new ThreadDetails(thread, comments, replies);

    expect(result.id).toBe(thread.id);
    expect(result.title).toBe(thread.title);
    expect(result.body).toBe(thread.body);
    expect(result.username).toBe(thread.username);
    expect(result.date).toBe(new Date(+thread.date));
    expect(result.comments.length).toBe(1);
    expect(result.comments[0].content).toBe("**komentar telah dihapus**");
    expect(result.comments[0].replies.length).toBe(1);
    expect(result.comments[0].replies[0].content).toBe(
      "**balasan telah dihapus**"
    );
  });
});
