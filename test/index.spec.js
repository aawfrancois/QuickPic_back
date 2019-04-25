import { expect } from "chai"
import sayHello from "../src/index2"
const server = require('../src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

describe("index2 test", () => {
    describe("sayHello function", () => {
        it("should say Hello guys!", () => {


            const str = sayHello();
            expect(str).to.equal("Hello guys!")
        })
    })
})

describe("test routes users", () => {
    describe("get /users", () => {
        it("should have obj!", () => {
            chai.request('localhost:3000/api').get('/users').end((err, res) => { // On requète la route GET
                res.should.have.status(200); // On vérifie le statu de la réponse
                res.body.should.be.a('object'); // On vérifie que le résultat est un tableau
                res.body.length.should.be.eql(0); // On vérifie que la longueur du tableau est de 0
                done(); // On dit à mocha que l'on a fini nos assertions
            });

            const str = sayHello();
            expect(str).to.equal("Hello guys!")
        })
    })
})
