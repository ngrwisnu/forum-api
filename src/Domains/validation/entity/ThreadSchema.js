import Joi from "joi";

export const postThreadSchema = Joi.object({
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).required(),
});
