import CommentRepository from "../CommentRepository";

describe("CommentRepository", () => {
  it("should throw an error when invoke the abstract", async () => {
    const commentRepository = new CommentRepository();

    expect(commentRepository.postComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.getCommentById("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.deleteCommentById("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.isCommentExist("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.threadsCommentsDetails()).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
