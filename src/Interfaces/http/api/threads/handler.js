import GetThreadByIdUseCase from "../../../../Applications/use_case/thread/GetThreadByIdUseCase.js";
import PostThreadUseCase from "../../../../Applications/use_case/thread/PostThreadUseCase.js";
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;

    const postThreadUseCase = this._container.getInstance(
      PostThreadUseCase.name
    );
    const postThread = await postThreadUseCase.execute(id, request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread: postThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const getThreadByIdUseCase = this._container.getInstance(
      GetThreadByIdUseCase.name
    );

    const getThreadById = await getThreadByIdUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread: getThreadById,
      },
    });
    response.code(200);
    return response;
  }
}

export default ThreadsHandler;
