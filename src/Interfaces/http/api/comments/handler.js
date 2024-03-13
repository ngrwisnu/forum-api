import DeleteCommentUseCase from "../../../../Applications/use_case/comment/DeleteCommentUseCase.js";
import PostCommentUseCase from "../../../../Applications/use_case/comment/PostCommentUseCase.js";

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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

  async deleteCommentHandler(request, h) {
    const token = request.headers.authorization;
    const { threadId, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute(token, threadId, commentId);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

export default CommentsHandler;
