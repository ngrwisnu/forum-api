import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import GetThreadByIdUseCase from "../GetThreadByIdUseCase";

describe("GetThreadByIdUseCase", () => {
  it("should return error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    expect(mockGetThreadUseCase.execute("thread-x")).rejects.toBe(
      "thread not found"
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-x");
  });

  it("should return object of thread detail", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });
    mockGetThreadUseCase.execute = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "thread-1" }));

    expect(mockGetThreadUseCase.execute("thread-1")).resolves.toStrictEqual({
      id: "thread-1",
    });
    expect(mockGetThreadUseCase.execute).toBeCalledWith("thread-1");
  });
});
