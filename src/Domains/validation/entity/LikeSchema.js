import Joi from "joi";

export const postCommentLikeSchema = Joi.object({
  uid: Joi.string().required(),
  threadId: Joi.string().required(),
  commentId: Joi.string().required(),
});
