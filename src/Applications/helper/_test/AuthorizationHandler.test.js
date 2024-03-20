import AuthorizationHandler from "../AuthorizationHandler";

describe("AuthorizationHandler", () => {
  it("should throw error when user is unauthorized", async () => {
    expect(() =>
      AuthorizationHandler.isAuthorized("user-1", "user-x")
    ).toThrowError("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
  });

  it("should return nothing user is authorized", async () => {
    expect(() =>
      AuthorizationHandler.isAuthorized("user-1", "user-1")
    ).not.toThrowError("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
  });
});
