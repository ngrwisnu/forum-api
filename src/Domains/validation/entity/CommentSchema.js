import Joi from "joi";

export const postCommentSchema = Joi.object({
  content: Joi.string().min(1).required(),
});
