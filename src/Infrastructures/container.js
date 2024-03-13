/* istanbul ignore file */

import { createContainer } from "instances-container";

// external agency
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import Jwt from "@hapi/jwt";
import pool from "./database/postgres/pool.js";

// service (repository, helper, manager, etc)
import UserRepository from "../Domains/users/UserRepository.js";
import PasswordHash from "../Applications/security/PasswordHash.js";
import UserRepositoryPostgres from "./repository/UserRepositoryPostgres.js";
import BcryptPasswordHash from "./security/BcryptPasswordHash.js";

// use case
import AddUserUseCase from "../Applications/use_case/AddUserUseCase.js";
import AuthenticationTokenManager from "../Applications/security/AuthenticationTokenManager.js";
import JwtTokenManager from "./security/JwtTokenManager.js";
import LoginUserUseCase from "../Applications/use_case/LoginUserUseCase.js";
import AuthenticationRepository from "../Domains/authentications/AuthenticationRepository.js";
import AuthenticationRepositoryPostgres from "./repository/AuthenticationRepositoryPostgres.js";
import LogoutUserUseCase from "../Applications/use_case/LogoutUserUseCase.js";
import RefreshAuthenticationUseCase from "../Applications/use_case/RefreshAuthenticationUseCase.js";
import ThreadRepositoryPostgre from "./repository/ThreadRepositoryPostgre.js";
import PostThreadUseCase from "../Applications/use_case/thread/PostThreadUseCase.js";
import CommentRepositoryPostgre from "./repository/CommentRepositoryPostgre.js";
import PostCommentUseCase from "../Applications/use_case/comment/PostCommentUseCase.js";
import DeleteCommentUseCase from "../Applications/use_case/comment/DeleteCommentUseCase.js";
import GetThreadByIdUseCase from "../Applications/use_case/thread/GetThreadByIdUseCase.js";
import PostReplyUseCase from "../Applications/use_case/reply/PostReplyUseCase.js";
import ReplyRepositoryPostgre from "./repository/ReplyRepositoryPostgre.js";
import DeleteReplyUseCase from "../Applications/use_case/reply/DeleteReplyUseCase.js";

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepositoryPostgre.name,
    Class: ThreadRepositoryPostgre,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepositoryPostgre.name,
    Class: CommentRepositoryPostgre,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyRepositoryPostgre.name,
    Class: ReplyRepositoryPostgre,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: PostThreadUseCase.name,
    Class: PostThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
        {
          name: "tokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: GetThreadByIdUseCase.name,
    Class: GetThreadByIdUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
      ],
    },
  },
  {
    key: PostCommentUseCase.name,
    Class: PostCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepositoryPostgre.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
        {
          name: "tokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepositoryPostgre.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
        {
          name: "tokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: PostReplyUseCase.name,
    Class: PostReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "replyRepository",
          internal: ReplyRepositoryPostgre.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepositoryPostgre.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
        {
          name: "tokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "replyRepository",
          internal: ReplyRepositoryPostgre.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepositoryPostgre.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepositoryPostgre.name,
        },
        {
          name: "tokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

export default container;
