import UpdateCommentLikeUseCase from "../../../../Applications/use_case/like/UpdateCommentLikeUseCase.js";

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.updateLikesByCommentIdHandler =
      this.updateLikesByCommentIdHandler.bind(this);
  }

  async updateLikesByCommentIdHandler(request, h) {
    const { id: uid } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const data = {
      uid,
      threadId,
      commentId,
    };

    const updateCommentLikeUseCase = this._container.getInstance(
      UpdateCommentLikeUseCase.name
    );

    await updateCommentLikeUseCase.execute(data);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

export default LikesHandler;
