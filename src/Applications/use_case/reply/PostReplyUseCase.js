import PostReply from "../../../Domains/replies/entities/PostReply.js";
import JoiValidation from "../../../Domains/validation/entity/JoiValidation.js";
import ReplySchema from "../../../Domains/validation/entity/ReplySchema.js";

class PostReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ uid, payload, threadId, commentId }) {
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);

    const request = JoiValidation.validate(ReplySchema.POST_REPLY, payload);

    request.user_id = uid;
    request.comment_id = commentId;
    request.created_at = new Date().getTime();

    const postReplyPayload = new PostReply(request);

    return this._replyRepository.postReply(postReplyPayload);
  }
}

export default PostReplyUseCase;
