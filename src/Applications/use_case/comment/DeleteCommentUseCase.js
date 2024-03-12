import AuthenticationHandler from "../../helper/AuthenticationHandler.js";
import AuthorizationHandler from "../../helper/AuthorizationHandler.js";

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository, tokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._tokenManager = tokenManager;
  }

  async execute(token, threadId, commentId) {
    await AuthenticationHandler.isAuthenticationTokenExist(token);
    token = AuthenticationHandler.purgeBearerOfToken(token);

    await this._commentRepository.isCommentExist(commentId);
    await this._threadRepository.isThreadExist(threadId);

    const user = await this._tokenManager.decodePayload(token);
    const comment = await this._commentRepository.getCommentById(commentId);

    await AuthorizationHandler.isAuthorized(comment.user_id, user.id);

    return this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;
