class CommentsLikes {
  #result = [];

  constructor(list) {
    this.#result = list;

    this._transformCount(list);
  }

  _transformCount(commentsLikes) {
    this.#result = commentsLikes.map((row) => ({
      ...row,
      count: +row.count,
    }));
  }

  getResult() {
    return this.#result;
  }
}

export default CommentsLikes;
