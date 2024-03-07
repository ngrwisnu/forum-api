class PostedThread {
  constructor(payload) {
    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.user_id;
    this.created_at = new Date(+payload.created_at);
  }
}

export default PostedThread;
