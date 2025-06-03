# Kaki's Northcoders News API

Hi! 👋 I'm Kaki — and this is a **portfolio project** I built during my backend learning journey at Northcoders. It’s part of a bootcamp task where we learn how to build and test RESTful APIs using Node.js and PostgreSQL.

This API mimics a Reddit-style article discussion platform. It lets you:

* View articles and filter by topic
* Read and post comments
* Upvote or downvote articles
* Explore users and related metadata

📊 Fully tested with Jest & Supertest
🌍 Hosted on Render

🔗 [Try the API live](https://nc-news-api-szrs.onrender.com/api)
📂 [View this repo on GitHub](https://github.com/kakiCoder511/NCnews)

---

## Project Overview

This project demonstrates backend skills including:

Setting up Express routes and controllers

Using PostgreSQL for persistent data

Building relational queries with joins

Handling errors and edge cases

Writing automated tests using Test-Driven Development (TDD)

It is designed to be used by front-end developers who want to interact with the API via fetch/axios.

---

## Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/kakiCoder511/NCnews.git
cd NCnews
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create two `.env` files in the root directory:

**.env.development**

```
PGDATABASE=nc_news
```

**.env.test**

```
PGDATABASE=nc_news_test
```

> Make sure these database names match your local PostgreSQL setup

### 4. Setup and seed your database

```bash
npm run setup-dbs
npm run seed
```

### 5. Run tests

```bash
npm test
```

---

## API Endpoints Summary

| Method | Endpoint                             | Description                                                                            |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------------- |
| GET    | /api                                 | List of all available endpoints                                                        |
| GET    | /api/topics                          | List of topics                                                                         |
| GET    | /api/articles                        | Returns all articles with comment counts. Supports `sort_by`, `order`, `topic` queries |
| GET    | /api/articles/\:article\_id          | Returns a single article including comment count                                       |
| PATCH  | /api/articles/\:article\_id          | Updates an article’s vote count                                                        |
| GET    | /api/articles/\:article\_id/comments | Returns all comments for an article                                                    |
| POST   | /api/articles/\:article\_id/comments | Adds a new comment                                                                     |
| DELETE | /api/comments/\:comment\_id          | Deletes a comment by ID                                                                |
| GET    | /api/users                           | Returns all users                                                                      |

---

## Example Errors Handled

| Scenario                          | Response           |
| --------------------------------- | ------------------ |
| Invalid article ID                | 400 Bad Request    |
| Non-existent article              | 404 Not Found      |
| Invalid sort/order queries        | 400 Bad Request    |
| Topic does not exist              | 404 Not Found      |
| Posting comment with unknown user | 404 User not found |

---

## Tech Stack

* Node.js (v18 or higher)
* Express
* PostgreSQL (v14 or higher)
* pg / pg-format
* Jest / Supertest for testing
* Hosted with Render

---


Thanks for checking it out! 🌟
