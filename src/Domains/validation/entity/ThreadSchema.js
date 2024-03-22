import Joi from "joi";

class ThreadSchema {
  static POST_THREAD = Joi.object({
    title: Joi.string().min(1).required(),
    body: Joi.string().min(1).required(),
  });
}

export default ThreadSchema;
