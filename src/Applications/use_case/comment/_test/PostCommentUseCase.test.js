import InvariantError from "../../../../Commons/exceptions/InvariantError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import PostComment from "../../../../Domains/comments/entities/PostComment";
import PostedComment from "../../../../Domains/comments/entities/PostedComment";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import PostCommentUseCase from "../PostCommentUseCase";

describe("PostCommentUseCase", () => {
  it("should throw error when content is empty", async () => {
    const payload = {
      content: "",
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: mockThreadRepository,
    });

    try {
      await postCommentUseCase.execute("", payload, "");
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError);
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
  });

  it("should throw error when content has invalid data type", async () => {
    const payload = {
      content: 10,
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: mockThreadRepository,
    });

    try {
      await postCommentUseCase.execute("", payload, "");
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError);
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
  });

  it("should throw error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: mockThreadRepository,
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
      expect(error).toBe("thread not found");
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
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
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        content: payload.content,
        user_id: "user-1",
        thread_id: params.threadId,
        created_at: new Date().getTime(),
      })
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });
});
