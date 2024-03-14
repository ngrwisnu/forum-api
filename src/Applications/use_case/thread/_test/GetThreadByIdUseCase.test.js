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

    try {
      await mockGetThreadUseCase.execute("thread-x");
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-x");
  });

  it("should return object of thread detail", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "thread-1" }));

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    const result = await mockGetThreadUseCase.execute("thread-1");

    expect(result).toStrictEqual({
      id: "thread-1",
    });
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-1");
  });
});
