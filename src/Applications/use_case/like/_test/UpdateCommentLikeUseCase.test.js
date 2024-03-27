import InvariantError from "../../../../Commons/exceptions/InvariantError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import LikeRepository from "../../../../Domains/likes/LikeRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import Validation from "../../../validation/Validation";
import UpdateCommentLikeUseCase from "../UpdateCommentLikeUseCase";
import PostedCommentLike from "../../../../Domains/likes/entities/PostedCommentLike";

describe("UpdateCommentLikeUseCase", () => {
  it("should throw an error if the user id is not a string", async () => {
    const data = {
      uid: 101,
      threadId: "thread-1",
      commentId: "comment-1",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(updateCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw an error if the thread id is not a string", async () => {
    const data = {
      uid: "user-1",
      threadId: true,
      commentId: "comment-1",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(updateCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw an error if the comment id is not a string", async () => {
    const data = {
      uid: "user-1",
      threadId: "thread-1",
      commentId: 101,
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(updateCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should return correct object when user like the comment for the first time", async () => {
    const data = {
      uid: "user-1",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    const mockPostedLike = new PostedCommentLike({
      user_id: data.uid,
      thread_id: data.threadId,
      comment_id: data.commentId,
      is_liked: true,
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

    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.isCommentLikedByUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(undefined));

    mockLikeRepository.postCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedLike));

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      validation: mockValidation,
    });

    const postedCommentLike = await updateCommentLikeUseCase.execute(data);

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockLikeRepository.postCommentLike).toBeCalledTimes(1);
    expect(mockLikeRepository.isCommentLikedByUser).toBeCalledTimes(1);
    expect(postedCommentLike).toStrictEqual(
      new PostedCommentLike({
        user_id: data.uid,
        thread_id: data.threadId,
        comment_id: data.commentId,
        is_liked: true,
      })
    );
  });

  it("should return correct object when user already like/dislike the comment before", async () => {
    const data = {
      uid: "user-1",
      threadId: "thread-1",
      commentId: "comment-1",
    };

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

    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.isCommentLikedByUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ is_liked: true }));

    mockLikeRepository.updateCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      validation: mockValidation,
    });

    const postedCommentLike = await updateCommentLikeUseCase.execute(data);

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockLikeRepository.updateCommentLike).toBeCalledTimes(1);
    expect(mockLikeRepository.isCommentLikedByUser).toBeCalledTimes(1);
    expect(postedCommentLike).toBe(1);
  });
});
