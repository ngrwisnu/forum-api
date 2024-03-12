class AuthenticationHandler {
  static isAuthorized(ownerId, targetId) {
    if (ownerId !== targetId)
      throw new Error("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
  }
}

export default AuthenticationHandler;
