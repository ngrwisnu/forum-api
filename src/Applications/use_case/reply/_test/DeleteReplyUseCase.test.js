import NotFoundError from "../../../../Commons/exceptions/NotFoundError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import GetReply from "../../../../Domains/replies/entities/GetReply";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import DeleteReplyUseCase from "../DeleteReplyUseCase";

describe("DeleteReplyUseCase", () => {
  const mockReply = new GetReply({
    id: "reply-1",
    content: "reply content",
    user_id: "user-1",
    comment_id: "comment-1",
    is_deleted: false,
    created_at: new Date().getTime(),
  });

  it("should throw error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("thread not found"))
      );

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      commentId: "comment-1",
      threadId: "thread-x",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error.message).toBe("thread not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(deleteReplyUseCase.execute(params)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when comment is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("comment not found"))
      );

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      commentId: "comment-x",
      threadId: "",
      replyId: "",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error.message).toBe("comment not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(deleteReplyUseCase.execute(params)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when reply is not found", async () => {
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
        Promise.reject(new NotFoundError("reply not found"))
      );

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-x",
    };

    try {
      await deleteReplyUseCase.execute(params);
    } catch (error) {
      expect(error.message).toBe("reply not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(params.replyId);
    expect(deleteReplyUseCase.execute(params)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when user is unauthorized", async () => {
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
      .mockImplementation(() => Promise.resolve(mockReply));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-x",
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
    expect(deleteReplyUseCase.execute(params)).rejects.toThrow(
      "AUTHORIZATION_HELPER.UNAUTHORIZED_USER"
    );
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
      .mockImplementation(() => Promise.resolve(mockReply));
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      commentId: "comment-1",
      threadId: "thread-1",
      replyId: "reply-1",
    };

    const result = await deleteReplyUseCase.execute(params);

    expect(result).toBe(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(params.replyId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(params.replyId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(params.replyId);
  });
});
