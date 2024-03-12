class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);

    const result = await this._threadRepository.getThreadById(threadId);

    return result;
  }
}

export default GetThreadByIdUseCase;
