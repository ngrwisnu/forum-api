import PostThreadUseCase from "../../../../Applications/use_case/thread/PostThreadUseCase.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const token = request.headers.authorization;

    if (!token) throw new AuthenticationError("Missing authentication");

    const postThreadUseCase = this._container.getInstance(
      PostThreadUseCase.name
    );
    const postThread = await postThreadUseCase.execute(token, request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread: postThread,
      },
    });
    response.code(201);
    return response;
  }
}

export default ThreadsHandler;
