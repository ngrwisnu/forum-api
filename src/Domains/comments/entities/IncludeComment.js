class IncludeComment {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.username = data.username;
    this.date = new Date(+data.date);

    if (data.is_deleted) {
      this.content = "**komentar telah dihapus**";
    }
  }
}

export default IncludeComment;
