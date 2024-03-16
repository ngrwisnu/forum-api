import IncludeComment from "../../../Domains/comments/entities/IncludeComment.js";
import IncludeReply from "../../../Domains/replies/entities/IncludeReply.js";

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

    const commentsDetails = comments.map((row) => {
      const comment = new IncludeComment(row);
      comment.replies = [];

      for (let reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(new IncludeReply(reply));
        }
      }

      return comment;
    });

    return {
      ...thread,
      comments: commentsDetails,
    };
  }
}

export default GetThreadByIdUseCase;
