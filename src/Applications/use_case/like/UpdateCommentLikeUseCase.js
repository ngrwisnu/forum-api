import LikeSchema from "../../../Domains/validation/entity/LikeSchema.js";

class UpdateCommentLikeUseCase {
  constructor({
    likeRepository,
    threadRepository,
    commentRepository,
    validation,
  }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._validation = validation;
  }

  async execute(data) {
    await this._validation.validate(LikeSchema.POST_COMMENT_LIKE, data);

    await this._threadRepository.isThreadExist(data.threadId);
    await this._commentRepository.isCommentExist(data.commentId);

    const likedStatus = await this._likeRepository.isCommentLikedByUser(
      data.uid,
      data.commentId
    );

    if (!likedStatus) {
      return this._likeRepository.postCommentLike(
        data.threadId,
        data.commentId,
        data.uid
      );
    }

    return this._likeRepository.updateCommentLike(
      data.uid,
      data.commentId,
      likedStatus.is_liked
    );
  }
}

export default UpdateCommentLikeUseCase;
