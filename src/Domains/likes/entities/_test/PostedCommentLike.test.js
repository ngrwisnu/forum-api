import PostedCommentLike from "../PostedCommentLike";

describe("PostedCommentLike entity", () => {
  it("should create the correct object", async () => {
    const data = {
      user_id: "user-1",
      thread_id: "thread-1",
      comment_id: "comment-1",
      is_liked: true,
    };

    const res = new PostedCommentLike(data);

    expect(res.user_id).toBe(data.user_id);
    expect(res.thread_id).toBe(data.thread_id);
    expect(res.comment_id).toBe(data.comment_id);
    expect(res.is_liked).toBe(true);
  });
});
