import IncludeComment from "../../comments/entities/IncludeComment.js";
import IncludeReply from "../../replies/entities/IncludeReply.js";

class ThreadDetails {
  constructor(thread, comments, replies, commentsLikes) {
    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.username = thread.username;
    this.date = new Date(+thread.date);
    this.comments = [];

    this._addCommentsProperty(comments);
    this._addRepliesProperty(replies);
    this._addCommentLikesProperty(commentsLikes);
  }

  _addCommentsProperty(comments) {
    const commentsDetails = comments.map((row) => new IncludeComment(row));

    this.comments = commentsDetails;
  }

  _addRepliesProperty(replies) {
    const comments = this.comments.map((comment) => {
      comment.replies = [];

      for (let reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(new IncludeReply(reply));
        }
      }

      return comment;
    });

    this.comments = comments;
  }

  _addCommentLikesProperty(commentsLikes) {
    const comments = this.comments.map((comment) => {
      comment.likeCount = 0;

      for (let commentLike of commentsLikes) {
        if (commentLike.comment_id === comment.id) {
          comment.likeCount = commentLike.count;
        }
      }

      return comment;
    });

    this.comments = comments;
  }
}

export default ThreadDetails;
