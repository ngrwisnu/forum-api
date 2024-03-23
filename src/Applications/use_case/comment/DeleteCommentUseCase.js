class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(uid, threadId, commentId) {
    await this._commentRepository.isCommentExist(commentId);
    await this._threadRepository.isThreadExist(threadId);

    const comment = await this._commentRepository.getCommentById(commentId);

    if (comment.user_id !== uid) {
      throw new Error("AUTHORIZATION_CHECKER.UNAUTHORIZED_USER");
    }

    return this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;
