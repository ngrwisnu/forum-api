import ThreadDetails from "../../../Domains/threads/entities/ThreadDetails.js";

class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.threadsCommentsDetails(
      threadId
    );
    const replies = await this._replyRepository.repliesDetails();
    const commentsLikes = await this._likeRepository.getCommentsLikesByThreadId(
      threadId
    );

    return new ThreadDetails(thread, comments, replies, commentsLikes);
  }
}

export default GetThreadByIdUseCase;
