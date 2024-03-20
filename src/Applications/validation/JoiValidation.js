import Validation from "./Validation.js";

class JoiValidation extends Validation {
  static validate(schema, request) {
    const result = schema.validate(request);

    if (result.error) {
      throw result.error;
    }

    return result.value;
  }
}

export default JoiValidation;
