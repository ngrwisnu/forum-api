import Validation from "../../Applications/validation/Validation.js";
import InvariantError from "../../Commons/exceptions/InvariantError.js";

class JoiValidation extends Validation {
  static validate(schema, request) {
    const result = schema.validate(request);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  }
}

export default JoiValidation;
