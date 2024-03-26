class LikeRepository {
  async postCommentLike(threadId, commentId, userId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async updateCommentLike(userId, commentId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

export default LikeRepository;
