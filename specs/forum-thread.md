# Forum Thread Specs

## Add Thread

Route: `POST` `/threads`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json
{
  "title": "any title",
  "body": "any body"
}
```

Response when `succeed`:

- Status Code: `201`
- Body:

```json
{
  "status": "success",
  "data": {
    "addedThread": {
      "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
      "title": "the title",
      "owner": "user-DWrT3pXe1hccYkV1eIAxS"
    }
  }
}
```

Response when `fail`:

- Status Code: `400`
- Body:

```json
{
  "status": "fail",
  "message": "any error message"
}
```

---

## Add Comment to a Thread

Route: `POST` `/threads/{threadId}/comments`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json
{
  "content": "any comment"
}
```

Response when `succeed`:

- Status Code: `201`
- Body:

```json
{
  "status": "success",
  "data": {
    "addedComment": {
      "id": "comment-_pby2_tmXV6bcvcdev8xk",
      "content": "any comment content",
      "owner": "user-CrkY5iAgOdMqv36bIvys2"
    }
  }
}
```

Response when _thread_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

Response when `fail`:

- Status Code: `400`
- Body:

```json
{
  "status": "fail",
  "message": "any error message"
}
```

---

## Delete Comment by ID

> **Do Not Delete the comment from database!** Instead use _is_deleted_ property in the db to set the state of the comment.

> Only the comment's owner can delete the comment.

Route: `DELETE` `/threads/{threadId}/comments/{commentId}`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json

```

Response when `succeed`:

- Status Code: `200`
- Body:

```json
{
  "status": "success"
}
```

Response when user who delete the comment is not the owner:

- Status Code: `403`
- Body:

```json
{
  "status": "fail",
  "message": "Unauthorized!"
}
```

Response when _thread_/_comment_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

---

## Get Thread Detail by ID

Route: `GET` `/threads/{threadId}`

Headers:

Request body:

```json

```

Response when `succeed`:

- Status Code: `200`
- Body:

```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "thread-h_2FkLZhtgBKY2kh4CC02",
      "title": "any thread title",
      "body": "any thread body",
      "date": "2021-08-08T07:19:09.775Z",
      "username": "stewie",
      "comments": [
        // ascending
        {
          "id": "comment-_pby2_tmXV6bcvcdev8xk",
          "username": "peterGriffin",
          "date": "2021-08-08T07:22:33.555Z",
          "content": "any comment content"
        },
        {
          "id": "comment-yksuCoxM2s4MMrZJO-qVD",
          "username": "bryan",
          "date": "2021-08-08T07:26:21.338Z",
          "content": "**comment has been deleted**"
        }
      ]
    }
  }
}
```

Response when _thread_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

---

## Add Reply to a Comment **(OPTIONAL)**

> Include all replies when get the thread detail

> Reply detail
>
> ```json
> {
>   "replies": [
>     //ascending
>     {
>       "id": "reply-BErOXUSefjwWGW1Z10Ihk",
>       "content": "**reply has been deleted**",
>       "date": "2021-08-08T07:59:48.766Z",
>       "username": "stewie"
>     },
>     {
>       "id": "reply-xNBtm9HPR-492AeiimpfN",
>       "content": "any reply content",
>       "date": "2021-08-08T08:07:01.522Z",
>       "username": "bryan"
>     }
>   ]
> }
> ```

Route: `POST` `/threads/{threadId}/comments/{commentId}/replies`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json
{
  "content": "any reply content"
}
```

Response when `succeed`:

- Status Code: `201`
- Body:

```json
{
  "status": "success",
  "data": {
    "addedReply": {
      "id": "reply-BErOXUSefjwWGW1Z10Ihk",
      "content": "any reply content",
      "owner": "user-CrkY5iAgOdMqv36bIvys2"
    }
  }
}
```

Response when _thread_/_comment_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

Response when `fail`:

- Status Code: `400`
- Body:

```json
{
  "status": "fail",
  "message": "any error message"
}
```

---

## Delete Reply by ID **(OPTIONAL)**

> **Do Not Delete the reply from database!** Instead use _is_deleted_ property in the db to set the state of the reply.

> Only the reply's owner can delete the reply.

Route: `DELETE` `/threads/{threadId}/comments/{commentId}/replies/{replyId}`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json

```

Response when `succeed`:

- Status Code: `200`
- Body:

```json
{
  "status": "success"
}
```

Response when user is not the owner:

- Status Code: `403`
- Body:

```json
{
  "status": "fail",
  "message": "Unauthorized!"
}
```

Response when _thread_/_comment_/_reply_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

---

## Put Comment's Like **(OPTIONAL)**

Route: `PUT` `/threads/{threadId}/comments/{commentId}/likes`

Headers:

- Authorization: `Bearer <token>`

Request body:

```json

```

Response when `succeed`:

- Status Code: `200`
- Body:

```json
{
  "status": "success"
}
```

Response when _thread_/_comment_ `not found`:

- Status Code: `404`
- Body:

```json
{
  "status": "fail",
  "message": "not found message!"
}
```

---
