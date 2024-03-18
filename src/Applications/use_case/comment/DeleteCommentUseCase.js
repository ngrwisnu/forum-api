import AuthorizationHandler from "../../helper/AuthorizationHandler.js";

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(uid, threadId, commentId) {
    await this._commentRepository.isCommentExist(commentId);
    await this._threadRepository.isThreadExist(threadId);

    const comment = await this._commentRepository.getCommentById(commentId);

    await AuthorizationHandler.isAuthorized(comment.user_id, uid);

    return this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;
