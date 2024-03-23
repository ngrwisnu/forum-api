import InvariantError from "../../../../Commons/exceptions/InvariantError";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import PostThread from "../../../../Domains/threads/entities/PostThread";
import PostedThread from "../../../../Domains/threads/entities/PostedThread";
import Validation from "../../../validation/Validation";
import PostThreadUseCase from "../PostThreadUseCase";

describe("PostThreadUseCase", () => {
  it("should throw error when title is empty", async () => {
    const payload = {
      title: "",
      body: "thread body content",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: {},
      validation: mockValidation,
    });

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw error when title has invalid data type", async () => {
    const payload = {
      title: 10,
      body: "thread body content",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: {},
      validation: mockValidation,
    });

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrow(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw error when body is empty", async () => {
    const payload = {
      title: "thread title",
      body: "",
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: {},
      validation: mockValidation,
    });

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });

  it("should throw error when body has invalid data type", async () => {
    const payload = {
      title: "thread title",
      body: true,
    };

    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError("error message"))
      );

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: {},
      validation: mockValidation,
    });

    // * assert
    expect(postedThreadUseCase.execute("", payload)).rejects.toThrowError(
      InvariantError
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
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
    const mockValidation = new Validation();
    mockValidation.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.postThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    // * create instance of use case
    const postedThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
      validation: mockValidation,
    });

    // * action
    const postedThread = await postedThreadUseCase.execute("user-1", payload);

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
    expect(mockThreadRepository.postThread).toBeCalledWith(
      new PostThread({
        title: payload.title,
        body: payload.body,
        user_id: "user-1",
        created_at: new Date().getTime(),
      })
    );
    expect(mockValidation.validate).toBeCalledTimes(1);
  });
});
