import Joi from "joi";

class CommentSchema {
  static POST_COMMENT = Joi.object({
    content: Joi.string().min(1).required(),
  });
}

export default CommentSchema;
