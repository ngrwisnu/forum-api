import DeleteReplyUseCase from "../../../../Applications/use_case/reply/DeleteReplyUseCase.js";
import PostReplyUseCase from "../../../../Applications/use_case/reply/PostReplyUseCase.js";

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: uid } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const postReplyUseCase = this._container.getInstance(PostReplyUseCase.name);

    const params = {
      uid,
      payload: request.payload,
      threadId,
      commentId,
    };

    const addedReply = await postReplyUseCase.execute(params);

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: uid } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    const params = {
      uid,
      threadId,
      commentId,
      replyId,
    };

    await deleteReplyUseCase.execute(params);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

export default RepliesHandler;
