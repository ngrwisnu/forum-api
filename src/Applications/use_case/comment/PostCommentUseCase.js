import PostComment from "../../../Domains/comments/entities/PostComment.js";
import { postCommentSchema } from "../../../Domains/validation/entity/CommentSchema.js";

class PostCommentUseCase {
  constructor({ commentRepository, threadRepository, validation }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._validation = validation;
  }

  async execute(uid, payload, threadId) {
    await this._validation.validate(postCommentSchema, payload);

    await this._threadRepository.isThreadExist(threadId);

    payload.user_id = uid;
    payload.thread_id = threadId;
    payload.created_at = new Date().getTime();

    const postCommentPayload = new PostComment(payload);

    return this._commentRepository.postComment(postCommentPayload);
  }
}

export default PostCommentUseCase;
