class GetReply {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.user_id = data.user_id;
    this.comment_id = data.comment_id;
    this.is_deleted = data.is_deleted;
    this.created_at = new Date(+data.created_at);
  }
}

export default GetReply;
