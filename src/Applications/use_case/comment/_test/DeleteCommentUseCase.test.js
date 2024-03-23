import NotFoundError from "../../../../Commons/exceptions/NotFoundError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import GetComment from "../../../../Domains/comments/entities/GetComment";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import DeleteCommentUseCase from "../DeleteCommentUseCase";

describe("DeleteCommentUseCase", () => {
  const mockComment = new GetComment({
    id: "comment-1",
    content: "comment content",
    user_id: "user-1",
    thread_id: "thread-1",
    is_deleted: false,
    created_at: new Date().getTime(),
  });

  it("should throw error when comment is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("comment not found"))
      );

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
      expect(error.message).toBe("comment not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(
      deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw error when thread is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("thread not found"))
      );

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
      expect(error.message).toBe("thread not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(
      deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw error when user is unauthorized", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

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
      expect(error.message).toBe("AUTHORIZATION_CHECKER.UNAUTHORIZED_USER");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(
      deleteCommentUseCase.execute(
        params.uid,
        params.threadId,
        params.commentId
      )
    ).rejects.toThrow("AUTHORIZATION_CHECKER.UNAUTHORIZED_USER");
  });

  it("should orchestrate the delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
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

    const result = await deleteCommentUseCase.execute(
      params.uid,
      params.threadId,
      params.commentId
    );

    expect(result).toBe(1);
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
