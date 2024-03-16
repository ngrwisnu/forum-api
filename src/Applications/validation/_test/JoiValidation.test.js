import Joi from "joi";
import JoiValidation from "../JoiValidation";

describe("JoiValidation", () => {
  it("should return error when the request does not match to the schema", async () => {
    const schema = Joi.object({
      title: Joi.string().min(1),
    });

    const request = {
      title: "",
    };

    expect(() => JoiValidation.validate(schema, request)).toThrow();
  });

  it("should succeed when the request meets the schema", async () => {
    const schema = Joi.object({
      title: Joi.string().min(1),
    });

    const request = {
      title: "thread title",
    };

    const result = JoiValidation.validate(schema, request);

    expect(result).toStrictEqual({
      title: request.title,
    });
  });
});
