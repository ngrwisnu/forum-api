import ThreadRepository from "../ThreadRepository.js";

describe("ThreadRepository", () => {
  it("should throw an error when invoke the abstract", async () => {
    const threadRepo = new ThreadRepository();

    expect(threadRepo.postThread({})).rejects.toThrowError();
  });
});
