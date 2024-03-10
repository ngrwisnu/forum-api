class PostComment {
  constructor(payload) {
    this.content = payload.content;
    this.user_id = payload.user_id;
    this.thread_id = payload.thread_id;
    this.created_at = +payload.created_at;
  }
}

export default PostComment;
