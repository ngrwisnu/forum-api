import PostThread from "../../../Domains/threads/entities/PostThread.js";
import JoiValidation from "../../../Infrastructures/validation/JoiValidation.js";
import AuthenticationHandler from "../../helper/AuthenticationHandler.js";
import ThreadSchema from "../../validation/threadSchema.js";

class PostThreadUseCase {
  constructor({ threadRepository, tokenManager }) {
    this._threadRepository = threadRepository;
    this._tokenManager = tokenManager;
  }

  async execute(token, payload) {
    await AuthenticationHandler.isAuthenticationTokenExist(token);
    token = AuthenticationHandler.purgeBearerOfToken(token);

    const request = JoiValidation.validate(ThreadSchema.POST_THREAD, payload);

    const user = await this._tokenManager.decodePayload(token);

    request.user_id = user.id;
    request.created_at = new Date().getTime();

    const postThreadPayload = new PostThread(request);

    return this._threadRepository.postThread(postThreadPayload);
  }
}

export default PostThreadUseCase;
