import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import GetThreadByIdUseCase from "../GetThreadByIdUseCase";
import ThreadDetails from "../../../../Domains/threads/entities/ThreadDetails";
import NotFoundError from "../../../../Commons/exceptions/NotFoundError";
import LikeRepository from "../../../../Domains/likes/LikeRepository";

describe("GetThreadByIdUseCase", () => {
  const mockTime = new Date();
  jest.spyOn(global, "Date").mockImplementation(() => mockTime);

  const thread = {
    id: "thread-1",
    title: "a title",
    body: "a body",
    date: new Date().getTime(),
    username: "stewie",
  };

  const comments = [
    {
      id: "comment-1",
      content: "a content",
      date: new Date().getTime(),
      username: "peter",
      is_deleted: false,
    },
  ];

  const replies = [
    {
      id: "reply-1",
      content: "a content",
      date: new Date().getTime(),
      username: "stewie",
      is_deleted: false,
      comment_id: "comment-1",
    },
    {
      id: "reply-2",
      content: "a content",
      date: new Date().getTime(),
      username: "stewie",
      is_deleted: false,
      comment_id: "comment-x",
    },
  ];

  const commentsLikes = [
    {
      comment_id: "comment-1",
      count: 3,
    },
    {
      comment_id: "comment-x",
      count: 1,
    },
  ];

  it("should return error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("thread not found"))
      );

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    expect(mockGetThreadUseCase.execute("thread-x")).rejects.toThrow(
      NotFoundError
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-x");
  });

  it("should return the correct object of thread details", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(thread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.threadsCommentsDetails = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.repliesDetails = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replies));

    const mockCommentLikeRepository = new LikeRepository();
    mockCommentLikeRepository.getCommentsLikesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentsLikes));

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockCommentLikeRepository,
    });

    const result = await mockGetThreadUseCase.execute("thread-1");

    expect(result).toStrictEqual(
      new ThreadDetails(thread, comments, replies, commentsLikes)
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-1");
    expect(mockCommentRepository.threadsCommentsDetails).toBeCalledWith(
      "thread-1"
    );
    expect(mockReplyRepository.repliesDetails).toBeCalledTimes(1);
    expect(
      mockCommentLikeRepository.getCommentsLikesByThreadId
    ).toBeCalledTimes(1);
  });
});
