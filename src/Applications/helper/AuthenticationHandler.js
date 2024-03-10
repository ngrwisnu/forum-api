class AuthenticationHandler {
  static isAuthenticationTokenExist(token) {
    if (!token) throw new Error("AUTHENTICATION_HELPER.NOT_AUTHENTICATED");

    return token;
  }

  static purgeBearerOfToken(token) {
    return token.replace("Bearer ", "");
  }
}

export default AuthenticationHandler;
