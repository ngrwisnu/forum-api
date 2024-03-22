import PostComment from "../../../Domains/comments/entities/PostComment.js";
import JoiValidation from "../../../Domains/validation/entity/JoiValidation.js";
import CommentSchema from "../../../Domains/validation/entity/CommentSchema.js";

class PostCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(uid, payload, threadId) {
    await this._threadRepository.isThreadExist(threadId);

    const request = JoiValidation.validate(CommentSchema.POST_COMMENT, payload);

    request.user_id = uid;
    request.thread_id = threadId;
    request.created_at = new Date().getTime();

    const postCommentPayload = new PostComment(request);

    return this._commentRepository.postComment(postCommentPayload);
  }
}

export default PostCommentUseCase;
