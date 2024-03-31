import PostThread from "../../../Domains/threads/entities/PostThread.js";
import { postThreadSchema } from "../../../Domains/validation/entity/ThreadSchema.js";

class PostThreadUseCase {
  constructor({ threadRepository, validation }) {
    this._threadRepository = threadRepository;
    this._validation = validation;
  }

  async execute(uid, payload) {
    await this._validation.validate(postThreadSchema, payload);

    payload.user_id = uid;
    payload.created_at = new Date().getTime();

    const postThreadPayload = new PostThread(payload);

    return this._threadRepository.postThread(postThreadPayload);
  }
}

export default PostThreadUseCase;
