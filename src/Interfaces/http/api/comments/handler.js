import PostCommentUseCase from "../../../../Applications/use_case/comment/PostCommentUseCase.js";

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const token = request.headers.authorization;
    const { threadId } = request.params;

    const postCommentUseCase = this._container.getInstance(
      PostCommentUseCase.name
    );
    const postComment = await postCommentUseCase.execute(
      token,
      request.payload,
      threadId
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment: postComment,
      },
    });
    response.code(201);
    return response;
  }
}

export default CommentHandler;
