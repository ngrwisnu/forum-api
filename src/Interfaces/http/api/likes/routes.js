const routes = (handler) => [
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: handler.updateLikesByCommentIdHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

export default routes;
