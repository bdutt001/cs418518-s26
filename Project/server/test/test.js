import request from "supertest";
import { expect } from "chai";
import app from "../app.js";

const email = `test_${Date.now()}@odu.com`;

describe("Backend API Test Cases", () => {

  // =========================
  // Successful Signup
  // =========================
  it("TC1: Should create a new user successfully", async () => {
    const response = await request(app)
      .post("/user")
      .send({
        u_first_name: "Test",
        u_last_name: "Student",
        u_email: email,
        u_password: "Password@123"
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("message");
  });


  // =========================
  // Weak Password Rejected
  // =========================
  it("TC2: Should reject weak password", async () => {
    const email = `test_${Date.now()}@odu.com`;
    const response = await request(app)
      .post("/user")
      .send({
        u_first_name: "Weak",
        u_last_name: "Password",
        u_email: email,
        u_password: "abc123"
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.include("Password");
  });


  // =========================
  // Invalid Login Attempt
  // =========================
  it("TC3: Should reject login with invalid credentials", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        u_email: "fakeuser@odu.edu",
        u_password: "WrongPassword@123"
      });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property("message");
  });

});