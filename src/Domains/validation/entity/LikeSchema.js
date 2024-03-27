import Joi from "joi";

class LikeSchema {
  static POST_COMMENT_LIKE = Joi.object({
    uid: Joi.string().required(),
    threadId: Joi.string().required(),
    commentId: Joi.string().required(),
  });
}

export default LikeSchema;
