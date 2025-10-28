import request from "supertest";
import app from "../../app.js";

describe("Health route", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
