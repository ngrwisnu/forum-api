import InvariantError from "../../../../Commons/exceptions/InvariantError";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import PostThread from "../../../../Domains/threads/entities/PostThread";
import PostedThread from "../../../../Domains/threads/entities/PostedThread";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import PostThreadUseCase from "../PostThreadUseCase";

describe("PostThreadUseCase", () => {
  it("should throw error when title is empty", async () => {
    const payload = {
      title: "",
      body: "thread body content",
    };

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({});

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
  });

  it("should throw error when title has invalid data type", async () => {
    const payload = {
      title: 10,
      body: "thread body content",
    };

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({});

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
  });

  it("should throw error when body is empty", async () => {
    const payload = {
      title: "thread title",
      body: "",
    };

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({});

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
  });

  it("should throw error when body has invalid data type", async () => {
    const payload = {
      title: "thread title",
      body: true,
    };

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({});

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
  });

  it("should throw error when title or body has invalid data type", async () => {
    const payload = {
      title: 100,
      body: "thread body content",
    };

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({});

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
  });

  it("should orchestrate the post thread action correctly", async () => {
    const payload = {
      title: "thread title",
      body: "thread body content",
    };

    // * mock Date()
    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const mockPostedThread = new PostedThread({
      id: "thread-1",
      title: payload.title,
      body: payload.body,
      user_id: "user-1",
      created_at: new Date().getTime(),
    });

    // * dependency for the use case
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));

    mockThreadRepository.postThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    // * action
    const postedThread = await postedThreadUseCase.execute("token123", payload);

    // * assert
    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: "thread-1",
        title: payload.title,
        body: payload.body,
        user_id: "user-1",
        created_at: new Date(),
      })
    );
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
    expect(mockThreadRepository.postThread).toBeCalledWith(
      new PostThread({
        title: payload.title,
        body: payload.body,
        user_id: "user-1",
        created_at: new Date().getTime(),
      })
    );
  });
});
