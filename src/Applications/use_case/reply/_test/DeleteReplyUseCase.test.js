import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import DeleteReplyUseCase from "../DeleteReplyUseCase";

describe("DeleteReplyUseCase", () => {
  it("should return error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "token123",
      commentId: "comment-1",
      threadId: "thread-x",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("thread not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should return error when comment is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("comment not found"));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "token123",
      commentId: "comment-x",
      threadId: "",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("comment not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should return error when reply is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("reply not found"));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "token123",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-x",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("reply not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(params.replyId);
  });

  it("should return error when user is unauthorized", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: "reply-1", user_id: "user-1" })
      );
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-x" }));

    const mockJwtTokenManager = new JwtTokenManager();
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "token123",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-1",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error.message).toBe("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(params.replyId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(params.replyId);
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith(params.token);
  });

  it("should orchestrate the delete reply action correctly", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const mockJwtTokenManager = new JwtTokenManager();
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "token123",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-1",
    };

    await deleteReplyUseCase.execute(params);

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(params.replyId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(params.replyId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(params.replyId);
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith(params.token);
  });
});
