class PostedReply {
  constructor(payload) {
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.user_id;
  }
}

export default PostedReply;
