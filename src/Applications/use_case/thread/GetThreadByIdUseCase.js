import ThreadDetails from "../../../Domains/threads/entities/ThreadDetails.js";

class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.threadsCommentsDetails(
      threadId
    );
    const replies = await this._replyRepository.repliesDetails();

    return new ThreadDetails(thread, comments, replies);
  }
}

export default GetThreadByIdUseCase;
