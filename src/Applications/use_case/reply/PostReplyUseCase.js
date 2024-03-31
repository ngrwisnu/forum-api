import PostReply from "../../../Domains/replies/entities/PostReply.js";
import { postReplySchema } from "../../../Domains/validation/entity/ReplySchema.js";

class PostReplyUseCase {
  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
    validation,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._validation = validation;
  }

  async execute({ uid, payload, threadId, commentId }) {
    await this._validation.validate(postReplySchema, payload);

    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);

    payload.user_id = uid;
    payload.comment_id = commentId;
    payload.created_at = new Date().getTime();

    const postReplyPayload = new PostReply(payload);

    return this._replyRepository.postReply(postReplyPayload);
  }
}

export default PostReplyUseCase;
