import LikeRepository from "../LikeRepository";

describe("LikeRepository", () => {
  it("should throw an error when invoke the postCommentLike abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.postCommentLike("", "", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the getCommentsByThreadId abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.getCommentsLikesByThreadId("")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the isCommentLikedByUser abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.isCommentLikedByUser("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the updateCommentLike abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.updateCommentLike("", "", true)).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
