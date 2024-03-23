import InvariantError from "../../../../Commons/exceptions/InvariantError";
import NotFoundError from "../../../../Commons/exceptions/NotFoundError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import PostComment from "../../../../Domains/comments/entities/PostComment";
import PostedComment from "../../../../Domains/comments/entities/PostedComment";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import Validation from "../../../validation/Validation";
import PostCommentUseCase from "../PostCommentUseCase";

describe("PostCommentUseCase", () => {
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

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: {},
      validation: mockValidation,
    });

    expect(postCommentUseCase.execute("", payload, "")).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw error when content has invalid data type", async () => {
    const payload = {
      content: 10,
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: {},
      validation: mockValidation,
    });

    expect(postCommentUseCase.execute("", payload, "")).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
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

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: mockThreadRepository,
      validation: mockValidation,
    });

    const params = {
      token: "user-1",
      payload: {},
      threadId: "",
    };

    try {
      await postCommentUseCase.execute(
        params.uid,
        params.payload,
        params.threadId
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(
      postCommentUseCase.execute(params.uid, params.payload, params.threadId)
    ).rejects.toThrow(NotFoundError);
  });

  it("should orchestrate the post comment action correctly", async () => {
    const payload = {
      content: "comment content",
    };

    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const mockPostedComment = new PostedComment({
      id: "comment-1",
      content: payload.content,
      user_id: "user-1",
      thread_id: "thread-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    });

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.postComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedComment));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      validation: mockValidation,
    });

    const params = {
      uid: "user-1",
      payload,
      threadId: "thread-1",
    };

    const postedComment = await postCommentUseCase.execute(
      params.uid,
      params.payload,
      params.threadId
    );

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        content: payload.content,
        user_id: "user-1",
        thread_id: params.threadId,
        created_at: new Date().getTime(),
      })
    );
    expect(postedComment).toStrictEqual(
      new PostedComment({
        id: "comment-1",
        content: payload.content,
        user_id: "user-1",
        thread_id: params.threadId,
        is_deleted: false,
        created_at: new Date(),
      })
    );
  });
});
