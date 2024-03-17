import ReplyRepository from "../ReplyRepository";

describe("ReplyRepository", () => {
  it("should throw an error when invoke the abstract", async () => {
    const replyRepository = new ReplyRepository();

    expect(replyRepository.postReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.getReplyById("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.deleteReplyById("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.isReplyExist("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.repliesDetails()).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
