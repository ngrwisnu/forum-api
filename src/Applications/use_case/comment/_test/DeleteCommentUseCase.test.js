import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import DeleteCommentUseCase from "../DeleteCommentUseCase";

describe("DeleteCommentUseCase", () => {
  it("should throw error when comment is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("comment not found"));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: {},
    });

    const params = {
      uid: "user-1",
      threadId: "thread-1",
      commentId: "comment-x",
    };

    try {
      await deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error).toBe("comment not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should throw error when thread is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      threadId: "thread-x",
      commentId: "comment-1",
    };

    try {
      await deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error).toBe("thread not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should throw error when user is unauthorized", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-x",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    try {
      await deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error.message).toBe("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should orchestrate the delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    await deleteCommentUseCase.execute(
      params.uid,
      params.threadId,
      params.commentId
    );

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });
});
