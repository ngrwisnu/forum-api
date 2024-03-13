const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
  },
  // {
  //   method: "DELETE",
  //   path: "/threads/{threadId}/comments/{commentId}",
  //   handler: handler.deleteCommentHandler,
  // },
];

export default routes;
