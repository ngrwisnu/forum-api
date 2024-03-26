import LikeRepository from "../LikeRepository";

describe("LikeRepository", () => {
  it("should throw an error when invoke the postCommentLike abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.postCommentLike("", "", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the updateCommentLike abstract", async () => {
    const likeRepo = new LikeRepository();

    expect(likeRepo.updateCommentLike("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
