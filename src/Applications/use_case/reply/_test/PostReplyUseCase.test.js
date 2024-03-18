import InvariantError from "../../../../Commons/exceptions/InvariantError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import PostReply from "../../../../Domains/replies/entities/PostReply";
import PostedReply from "../../../../Domains/replies/entities/PostedReply";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import PostReplyUseCase from "../PostReplyUseCase";

describe("PostReplyUseCase", () => {
  it("should throw error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      payload: {},
      threadId: "",
      commentId: "",
    };

    try {
      await postReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("thread not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should throw error when comment is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("comment not found"));

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      payload: {},
      threadId: "",
      commentId: "comment-x",
    };

    try {
      await postReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBe("comment not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should throw error when content is empty", async () => {
    const payload = {
      content: "",
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "",
      payload,
      threadId: "",
      commentId: "",
    };

    try {
      await postReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError);
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should throw error when content has invalid data type", async () => {
    const payload = {
      content: true,
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "",
      payload,
      threadId: "",
      commentId: "",
    };

    try {
      await postReplyUseCase.execute(params);
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError);
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should orchestrate the post reply action correctly", async () => {
    const payload = {
      content: "reply content",
    };

    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const mockPostedReply = new PostedReply({
      id: "reply-1",
      content: payload.content,
      user_id: "user-1",
      comment_id: "comment-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.postReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedReply));

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const params = {
      uid: "user-1",
      payload,
      threadId: "thread-1",
      commentId: "comment-1",
    };

    const postedReply = await postReplyUseCase.execute(params);

    expect(postedReply).toStrictEqual(
      new PostedReply({
        id: "reply-1",
        content: payload.content,
        user_id: "user-1",
        comment_id: params.commentId,
        is_deleted: false,
        created_at: new Date(),
      })
    );
    expect(mockReplyRepository.postReply).toBeCalledWith(
      new PostReply({
        content: payload.content,
        user_id: "user-1",
        comment_id: params.commentId,
        created_at: new Date().getTime(),
      })
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });
});
