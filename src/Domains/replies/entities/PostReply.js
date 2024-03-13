class PostReply {
  constructor(payload) {
    this.content = payload.content;
    this.user_id = payload.user_id;
    this.comment_id = payload.comment_id;
    this.created_at = +payload.created_at;
  }
}

export default PostReply;
