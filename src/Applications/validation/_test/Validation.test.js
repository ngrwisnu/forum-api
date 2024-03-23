import Validation from "../Validation";

describe("Validation", () => {
  it("should throw error when call the method", async () => {
    const validation = new Validation();

    expect(validation.validate({}, {})).rejects.toThrow(
      "VALIDATION.METHOD_NOT_IMPLEMENTED"
    );
  });
});
