import CommentRepository from "../CommentRepository";

describe("CommentRepository", () => {
  it("should throw an error when invoke the abstract", async () => {
    const commentRepository = new CommentRepository();

    expect(commentRepository.postComment({})).rejects.toThrowError();
    expect(commentRepository.getCommentById("")).rejects.toThrowError();
    expect(commentRepository.deleteCommentById("")).rejects.toThrowError();
    expect(commentRepository.isCommentExist("")).rejects.toThrowError();
  });
});
