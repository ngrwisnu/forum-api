class GetThread {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.user_id = data.user_id;
    this.created_at = new Date(+data.created_at);
  }
}

export default GetThread;
