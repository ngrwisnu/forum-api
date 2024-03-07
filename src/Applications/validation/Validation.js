/* istanbul ignore file */
import InvariantError from "../../Commons/exceptions/InvariantError.js";

class Validation {
  static validate(schema, request) {
    const result = schema.validate(request);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  }
}

export default Validation;