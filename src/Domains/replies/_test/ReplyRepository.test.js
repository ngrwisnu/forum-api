import ReplyRepository from "../ReplyRepository";

describe("ReplyRepository", () => {
  it("should throw an error when invoke the abstract", async () => {
    const replyRepository = new ReplyRepository();

    expect(replyRepository.postReply({})).rejects.toThrowError();
    expect(replyRepository.getReplyById("")).rejects.toThrowError();
    expect(replyRepository.deleteReplyById("")).rejects.toThrowError();
    expect(replyRepository.isReplyExist("")).rejects.toThrowError();
  });
});
