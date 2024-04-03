class PostedCommentLike {
  constructor(data) {
    this.user_id = data.user_id;
    this.thread_id = data.thread_id;
    this.comment_id = data.comment_id;
    this.is_liked = data.is_liked;
  }
}

export default PostedCommentLike;
