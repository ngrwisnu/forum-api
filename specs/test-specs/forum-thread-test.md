### Add Thread

- [x] Returns `error` when token is not provided
- [x] Returns `error` when thread title or body is not provided
- [x] Returns `error` when payload data type is invalid
- [x] Returns `succeed` when token and payload are valid

---

### Add Comment to a Thread

- [x] Returns `error` when token is not provided
- [x] Returns `error` when the thread is not found
- [x] Returns `error` when content is not provided
- [x] Returns `error` when payload data type is invalid
- [x] Returns `succeed` when token and payload are valid

---

### Delete Comment by ID

- [x] Returns `error` when token is not provided
- [x] Returns `error` when the _thread_ or _comment_ is not found
- [x] Returns `error` when user who delete the comment is not the owner
- [x] Returns `succeed` when the comment success deleted

---

### Get Thread Detail by ID

- [x] Returns `error` when thread is not found
- [x] Returns `succeed` when thread id is valid

---

### Add Reply to a Comment **(OPTIONAL)**

- [ ] Returns `error` when token is not provided
- [ ] Returns `error` when the _thread_ or _comment_ is not found
- [ ] Returns `error` when content is not provided
- [ ] Returns `error` when payload data type is invalid
- [ ] Returns `succeed` when success add new reply

---

### Delete Reply by ID **(OPTIONAL)**

- [ ] Returns `error` when token is not provided
- [ ] Returns `error` when user is not the owner
- [ ] Returns `error` when the _thread_ /_comment_/_reply_ is not found
- [ ] Returns `succeed` when success delete the reply

---
