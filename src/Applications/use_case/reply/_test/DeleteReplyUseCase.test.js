import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import DeleteReplyUseCase from "../DeleteReplyUseCase";

describe("DeleteReplyUseCase", () => {
  it("should return error when token auth is not provided", async () => {
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    const params = {
      token: undefined,
      threadId: "",
      commentId: "",
      replyId: "",
    };

    expect(() => deleteReplyUseCase.execute(params)).rejects.toThrow(
      "AUTHENTICATION_HELPER.NOT_AUTHENTICATED"
    );
  });

  it("should return error when comment is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("comment not found"));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: {},
    });

    const params = {
      token: "Bearer token123",
      commentId: "comment-x",
      threadId: "",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("comment not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-x");
  });

  it("should return error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "Bearer token123",
      commentId: "comment-1",
      threadId: "thread-x",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("thread not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-1");
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-x");
  });

  it("should return error when user is unauthorized", async () => {
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "reply-1", user_id: "user-1" })
      );
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-x" }));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "Bearer token123",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-1",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-1");
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockReplyRepository.isReplyExist).toBeCalledWith("reply-1");
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
  });

  it("should orchestrate the delete reply action correctly", async () => {
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "reply-1", user_id: "user-1" })
      );
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "reply-1", user_id: "user-1" })
      );
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve("success"));
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "Bearer token123",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-1",
    };

    await deleteReplyUseCase.execute(params);

    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-1");
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
    expect(mockReplyRepository.isReplyExist).toBeCalledWith("reply-1");
  });
});
