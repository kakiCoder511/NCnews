const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { toBeSortedBy } = require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const endpoints = body.endpoints;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics ", () => {
  test("200: Resonds with an array of all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200 :Responds with an object by articel_id, including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 100,

          comment_count: "11",
        });
      });
  });
  test("404: responds not found for non-exist article_id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with bad request for invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects with expected properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  //task 10
  test("200: articles are sorted by created_at DESC by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: articles are sorted by votes ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("200: filters articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("400: invalid sort_by returns Bad Request", () => {
    // sort_by=invalid test
    return request(app)
      .get("/api/articles?sort_by=votesBy&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: invalid order returns Bad Request", () => {
    // order= invaild order request
    return request(app)
      .get("/api/articles?sort_by=votesBy&order=up")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  //Bad queries test
  test("200: responds with empty array when topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
      });
  });
  test("404: responds with 'Topic not found' when topic does not in the database", () => {
    return request(app)
      .get("/api/articles?topic=not_exists")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with all comments for an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  //We have an article with no associated comments. In this case I would expect 200 returns empty array of comments
  test("200: responds with no associated comments, empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("201:responds with posted comments ", () => {
    const insertedComment = {
      username: "butter_bridge",
      body: "testing the comment data insertion",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(insertedComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "testing the comment data insertion",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: responds with bad request for invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds not found for non-existient article_id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400:responds bad request when body is missing", () => {
    const missingComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(missingComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400:responds bad request when username is missing", () => {
    const missingComment = {
      body: "testing the comment data insertion",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(missingComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds  with not found if username doesnot exists", () => {
    const fakeUser = {
      username: "Kaki",
      body: "I am real but not in DB",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(fakeUser)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: reponds with new votes updated number", () => {
    const newVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 103,
          })
        );
      });
  });
  test("404: responds not found for non-exist article_id", () => {
    const newVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with bad request for invalid article_id", () => {
    const newVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with bad request if inc_votes is not a number", () => {
    const newVote = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid inc_votes value");
      });
  });
  //inc_is missing
  test("400: responds with bad request if inc_votes is missing", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid inc_votes value");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: successfully deletes a comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: responds with bad request if comment ID is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with comment not found for non-exist comment ID", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with users with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("💥404 error💥for all wrong path", () => {
  test("404: responds with not found when given wrong path", () => {
    return request(app)
      .get("/api/topeeeic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
