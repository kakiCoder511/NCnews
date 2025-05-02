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
  test("200 :Responds with an object by articel_id", () => {
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
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
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
});

describe("/api/articles/:article_id/comments", () => {
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

describe("PATCH /api/articles/:article_id",() =>{
  test("")
})