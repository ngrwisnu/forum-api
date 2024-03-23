import Joi from "joi";
import InvariantError from "../../../Commons/exceptions/InvariantError";
import JoiValidation from "../JoiValidation";

describe("JoiValidation", () => {
  it("should return error when the request does not match to the schema", async () => {
    const schema = Joi.object({
      title: Joi.string().min(1),
    });

    const request = {
      title: "",
    };

    const validation = new JoiValidation();

    expect(validation.validate(schema, request)).rejects.toThrow(
      '"title" is not allowed to be empty'
    );

    try {
      await validation.validate(schema, request);
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError);
    }
  });

  it("should succeed when the request meets the schema", async () => {
    const schema = Joi.object({
      title: Joi.string().min(1),
    });

    const request = {
      title: "thread title",
    };

    const validation = new JoiValidation();

    expect(() => validation.validate(schema, request)).not.toThrow(
      '"title" is not allowed to be empty'
    );
  });
});
