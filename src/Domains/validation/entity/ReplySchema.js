import Joi from "joi";

export const postReplySchema = Joi.object({
  content: Joi.string().min(1).required(),
});
