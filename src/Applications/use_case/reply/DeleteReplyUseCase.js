class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ uid, threadId, commentId, replyId }) {
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);
    await this._replyRepository.isReplyExist(replyId);

    const reply = await this._replyRepository.getReplyById(replyId);

    if (reply.user_id !== uid) {
      throw new Error("AUTHORIZATION_CHECKER.UNAUTHORIZED_USER");
    }

    return this._replyRepository.deleteReplyById(replyId);
  }
}

export default DeleteReplyUseCase;
