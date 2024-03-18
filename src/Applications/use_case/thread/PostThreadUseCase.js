import PostThread from "../../../Domains/threads/entities/PostThread.js";
import JoiValidation from "../../validation/JoiValidation.js";
import ThreadSchema from "../../validation/threadSchema.js";

class PostThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(uid, payload) {
    const request = JoiValidation.validate(ThreadSchema.POST_THREAD, payload);

    request.user_id = uid;
    request.created_at = new Date().getTime();

    const postThreadPayload = new PostThread(request);

    return this._threadRepository.postThread(postThreadPayload);
  }
}

export default PostThreadUseCase;
