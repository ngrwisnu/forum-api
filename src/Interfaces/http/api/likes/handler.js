import PostCommentLikeUseCase from "../../../../Applications/use_case/like/PostCommentLikeUseCase.js";

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.updateLikesByCommentIdHandler =
      this.updateLikesByCommentIdHandler.bind(this);
  }

  async updateLikesByCommentIdHandler(request, h) {
    const { id } = request.auth.credentials;

    const postCommentLikeUseCase = this._container.getInstance(
      PostCommentLikeUseCase.name
    );
    const addedLike = await postCommentLikeUseCase.execute(id, request.payload);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

export default LikesHandler;
