import InvariantError from "../../../../Commons/exceptions/InvariantError";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import LikeRepository from "../../../../Domains/likes/LikeRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import Validation from "../../../validation/Validation";
import PostCommentLikeUseCase from "../postCommentLikeUseCase";
import PostedCommentLike from "../../../../Domains/likes/entities/PostedCommentLike";

describe("PostCommentLikeUseCase", () => {
  it("should throw an error if the user id is not a string", async () => {
    const data = {
      uid: 101,
      thread_id: "thread-1",
      comment_id: "comment-1",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postCommentLikeUseCase = new PostCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(postCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw an error if the thread id is not a string", async () => {
    const data = {
      uid: "user-1",
      thread_id: true,
      comment_id: "comment-1",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postCommentLikeUseCase = new PostCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(postCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw an error if the comment id is not a string", async () => {
    const data = {
      uid: "user-1",
      thread_id: "thread-1",
      comment_id: 101,
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    const postCommentLikeUseCase = new PostCommentLikeUseCase({
      validation: mockValidation,
    });

    expect(postCommentLikeUseCase.execute(data)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should return correct object when the action succeed", async () => {
    const data = {
      uid: "user-1",
      thread_id: "thread-1",
      comment_id: "comment-1",
    };

    const mockPostedLike = new PostedCommentLike({
      user_id: data.uid,
      thread_id: data.thread_id,
      comment_id: data.comment_id,
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
    mockLikeRepository.postCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedLike));

    const postCommentLikeUseCase = new PostCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      validation: mockValidation,
    });

    const postedCommentLike = await postCommentLikeUseCase.execute(data);

    expect(mockValidation.validate).toBeCalledTimes(1);
    expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockLikeRepository.postCommentLike).toBeCalledTimes(1);
    expect(postedCommentLike).toStrictEqual(
      new PostedCommentLike({
        user_id: data.uid,
        thread_id: data.thread_id,
        comment_id: data.comment_id,
        is_liked: true,
      })
    );
  });
});
