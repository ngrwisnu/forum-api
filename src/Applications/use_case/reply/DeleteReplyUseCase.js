import AuthorizationHandler from "../../helper/AuthorizationHandler.js";

class DeleteReplyUseCase {
  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
    tokenManager,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._tokenManager = tokenManager;
  }

  async execute({ token, threadId, commentId, replyId }) {
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);
    await this._replyRepository.isReplyExist(replyId);

    const user = await this._tokenManager.decodePayload(token);
    const reply = await this._replyRepository.getReplyById(replyId);

    await AuthorizationHandler.isAuthorized(reply.user_id, user.id);

    return this._replyRepository.deleteReplyById(replyId);
  }
}

export default DeleteReplyUseCase;
