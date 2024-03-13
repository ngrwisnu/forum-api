import PostReply from "../../../Domains/replies/entities/PostReply.js";
import JoiValidation from "../../../Infrastructures/validation/JoiValidation.js";
import AuthenticationHandler from "../../helper/AuthenticationHandler.js";
import ReplySchema from "../../validation/ReplySchema.js";

class PostReplyUseCase {
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

  async execute({ token, payload, threadId, commentId }) {
    await AuthenticationHandler.isAuthenticationTokenExist(token);
    token = AuthenticationHandler.purgeBearerOfToken(token);

    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);

    const user = await this._tokenManager.decodePayload(token);

    const request = JoiValidation.validate(ReplySchema.POST_REPLY, payload);
    request.user_id = user.id;
    request.comment_id = commentId;
    request.created_at = new Date().getTime();

    const postReplyPayload = new PostReply(request);

    return this._replyRepository.postReply(postReplyPayload);
  }
}

export default PostReplyUseCase;
