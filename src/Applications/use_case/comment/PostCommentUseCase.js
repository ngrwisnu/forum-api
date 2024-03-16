import PostComment from "../../../Domains/comments/entities/PostComment.js";
import JoiValidation from "../../validation/JoiValidation.js";
import AuthenticationHandler from "../../helper/AuthenticationHandler.js";
import CommentSchema from "../../validation/CommentSchema.js";

class PostCommentUseCase {
  constructor({ commentRepository, threadRepository, tokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._tokenManager = tokenManager;
  }

  async execute(token, payload, threadId) {
    await AuthenticationHandler.isAuthenticationTokenExist(token);
    token = AuthenticationHandler.purgeBearerOfToken(token);

    await this._threadRepository.isThreadExist(threadId);

    const user = await this._tokenManager.decodePayload(token);

    const request = JoiValidation.validate(CommentSchema.POST_COMMENT, payload);
    request.user_id = user.id;
    request.thread_id = threadId;
    request.created_at = new Date().getTime();

    const postCommentPayload = new PostComment(request);

    return this._commentRepository.postComment(postCommentPayload);
  }
}

export default PostCommentUseCase;
