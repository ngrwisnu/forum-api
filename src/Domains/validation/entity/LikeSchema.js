import Joi from "joi";

class LikeSchema {
  static POST_COMMENT_LIKE = Joi.object({
    uid: Joi.string().required(),
    thread_id: Joi.string().required(),
    comment_id: Joi.string().required(),
  });
}

export default LikeSchema;
