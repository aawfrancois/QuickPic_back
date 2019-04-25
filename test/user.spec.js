import { expect } from "chai"
const server = require('../src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Students", () => {
    describe("GET /users", () => {
        // Test to get single student record
        it("should not get a single student record", (done) => {
            const id = 5;
            chai.request(server)
                .get(`/${id}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
