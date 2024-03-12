import Validation from "../Validation.js";

describe("Validation interface", () => {
  it("should throw error when invoke abstract behavior", () => {
    expect(() => Validation.validate({}, {})).toThrow(
      "SCHEMA_VALIDATION.METHOD_NOT_IMPLEMENTED"
    );
  });
});
