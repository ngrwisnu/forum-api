import Joi from "joi";

class ReplySchema {
  static POST_REPLY = Joi.object({
    content: Joi.string().min(1).required(),
  });
}

export default ReplySchema;
