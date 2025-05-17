# Possible Errors

This is a guide to the possible errors that may happen in your app. We have left some of them blank to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

The following is _not_ a comprehensive list! Its purpose is just to get the ball rolling down the sad path 😢

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: 404
- Response : { msg: "Path not found" }

---

## Available Routes

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
  - Status: `400 Bad Request`
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
  - Status: `404 Article not found`

---

### PATCH `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
  - Status: `400 Bad Request`
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
  - Status: `404 Article not found`
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)
  - Status: `400 Invalid inc_votes value`
- Missing `inc_votes` key
  - Status: `400 Invalid inc_votes value`

---

### POST `/api/articles/:article_id/comments`

- Missing `username` or `body`
  - Status: `400 Bad Request`
- Username not found in DB
  - Status: `404 User not found`

---

### GET `/api/articles/:article_id/comments`

- Bad `article_id` (e.g. `/dog`)
  - Status: `400 Bad Request`
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
  - Status: `404 Article not found`
- Article has no comments
  - Status: `200 OK` with empty array

---

### GET `/api/articles`

- Bad queries:
  - `sort_by` a column that doesn't exist
    - Status: `400 Bad Request`
  - `order` not equal to `"asc"` or `"desc"`
    - Status: `400 Bad Request`
  - `topic` that is not in the database
    - Status: `404 Topic not found`
  - `topic` that exists but has no articles
    - Status: `200 OK` with empty array

---

### PATCH `/api/comments/:comment_id`

- *Ongoing development*

---

### DELETE `/api/comments/:comment_id`

- Bad `comment_id` (e.g. `/dog`)
  - Status: `400 Bad Request`
- Well formed `comment_id` that doesn't exist (e.g. `/999999`)
  - Status: `404 Comment not found`
- Valid deletion
  - Status: `204 No Content`
