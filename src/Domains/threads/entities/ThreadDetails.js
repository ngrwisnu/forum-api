import IncludeComment from "../../comments/entities/IncludeComment.js";
import IncludeReply from "../../replies/entities/IncludeReply.js";

class ThreadDetails {
  constructor(thread, comments, replies) {
    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.username = thread.username;
    this.date = new Date(+thread.date);
    this.comments = [];

    this._addCommentsAndReplies(comments, replies);
  }

  _addCommentsAndReplies(comments, replies) {
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

    this.comments = commentsDetails;
  }
}

export default ThreadDetails;
