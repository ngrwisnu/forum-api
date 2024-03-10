import AuthenticationHandler from "../AuthenticationHandler";

describe("AuthenticationHandler", () => {
  it("should return correct response", async () => {
    expect(() =>
      AuthenticationHandler.isAuthenticationTokenExist()
    ).toThrowError();
    expect(() =>
      AuthenticationHandler.isAuthenticationTokenExist("Bearer token123").toBe(
        "Bearer token123"
      )
    ).toThrowError();
    expect(AuthenticationHandler.purgeBearerOfToken("Bearer token123")).toBe(
      "token123"
    );
  });
});
