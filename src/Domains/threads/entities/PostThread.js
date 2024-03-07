class PostThread {
  constructor(payload) {
    this.title = payload.title;
    this.body = payload.body;
    this.user_id = payload.user_id;
    this.created_at = +payload.created_at;
  }
}

export default PostThread;
