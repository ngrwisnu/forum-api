class TokenFormatter {
  static purgeBearerOfToken(token) {
    return token.replace("Bearer ", "");
  }
}

export default TokenFormatter;
