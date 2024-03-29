import ThreadRepository from "../ThreadRepository.js";

describe("ThreadRepository", () => {
  it("should throw an error when invoke the postThread abstract", async () => {
    const threadRepo = new ThreadRepository();

    expect(threadRepo.postThread({})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the getThreadById abstract", async () => {
    const threadRepo = new ThreadRepository();

    expect(threadRepo.getThreadById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw an error when invoke the isThreadExist abstract", async () => {
    const threadRepo = new ThreadRepository();

    expect(threadRepo.isThreadExist("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
