import InvariantError from "../../../../Commons/exceptions/InvariantError";
import NotFoundError from "../../../../Commons/exceptions/NotFoundError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import PostReply from "../../../../Domains/replies/entities/PostReply";
import PostedReply from "../../../../Domains/replies/entities/PostedReply";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import Validation from "../../../validation/Validation";
import PostReplyUseCase from "../PostReplyUseCase";

describe("PostReplyUseCase", () => {
  it("should throw error when content is empty", async () => {
    const payload = {
      content: "",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      threadRepository: {},
      validation: mockValidation,
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

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(postReplyUseCase.execute(params)).rejects.toThrow(InvariantError);
  });

  it("should throw error when content has invalid data type", async () => {
    const payload = {
      content: true,
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      threadRepository: {},
      validation: mockValidation,
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
      expect(error.message).toBe("error message");
    }

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(postReplyUseCase.execute(params)).rejects.toThrow(InvariantError);
  });

  it("should throw error when thread is not found", async () => {
    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("thread not found"))
      );

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      threadRepository: mockThreadRepository,
      validation: mockValidation,
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
      expect(error.message).toBe("thread not found");
    }

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(postReplyUseCase.execute(params)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when comment is not found", async () => {
    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

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

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      validation: mockValidation,
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
      expect(error.message).toBe("comment not found");
    }

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(postReplyUseCase.execute(params)).rejects.toThrow(NotFoundError);
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

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

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
      validation: mockValidation,
    });

    const params = {
      uid: "user-1",
      payload,
      threadId: "thread-1",
      commentId: "comment-1",
    };

    const postedReply = await postReplyUseCase.execute(params);

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
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
  });
});
