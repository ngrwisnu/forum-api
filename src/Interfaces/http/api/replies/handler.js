import PostReplyUseCase from "../../../../Applications/use_case/reply/PostReplyUseCase.js";

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    // this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const token = request.headers.authorization;
    const { threadId, commentId } = request.params;
    const postReplyUseCase = this._container.getInstance(PostReplyUseCase.name);

    const params = {
      token,
      payload: request.payload,
      threadId,
      commentId,
    };

    const postReply = await postReplyUseCase.execute(params);

    const response = h.response({
      status: "success",
      data: {
        addedReply: postReply,
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

export default RepliesHandler;
