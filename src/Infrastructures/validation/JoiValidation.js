import Validation from "../../Applications/validation/Validation.js";
import InvariantError from "../../Commons/exceptions/InvariantError.js";

class JoiValidation extends Validation {
  async validate(schema, request) {
    const result = schema.validate(request);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
}

export default JoiValidation;
