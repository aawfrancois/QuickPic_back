const Sequelize = require('sequelize');
const chai = require('chai');
const should = chai.should();
const server = require('../src/index');
const User = require ('../models/user');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('User', () => {
    describe('/GET users', () => { // La suite de tests pour la route GET
        it('should get all user when no items are in database', (done) => { // Test qui vérifie qu'il n'y a pas d'erreurs lorsque la base de données est vide
            chai.request(server).get('/users').end((err, res) => { // On requète la route GET
                res.should.have.status(200); // On vérifie le statu de la réponse
                res.body.should.be.a('array'); // On vérifie que le résultat est un tableau
                res.body.length.should.be.eql(0); // On vérifie que la longueur du tableau est de 0
                done(); // On dit à mocha que l'on a fini nos assertions
            });
        });

        it('should get all todo items when there are two items in the database', (done) => { // Test qui vérifie qu'on a le bon résultat lorsqu'il y a deux items dans la base de données
            const firstUser = new User({
                nickname: 'antoine',
                email: 'antoinefrancois95@gmail.com',
                password: 'testtest',
                password_confirmation:'testtest',
            });

            const secondUser = new User({
                name: 'jeremy',
                email: 'jeremynohile@gmail.com',
                password: 'testtest',
                password_confirmation:'testtest',
            });
            firstUser.save(() => { // On sauvegarde les items dans la base de données
                secondUser.save(() => {
                    chai.request(server).get('/api').end((err, res) => {
                        // res.should.have.status(200);
                        // res.body.should.be.a('array');
                        // res.body.length.should.be.eql(2);
                        // res.body[0].name.should.be.eql(firstUser.nickname); // On vérifie que les éléments retournés par la route sont semblables à ceux que l'on a enregistré dans la base
                        // res.body[0].status.should.be.eql(firstUser.email);
                        // res.body[1].name.should.be.eql(secondUser.nickname);
                        // res.body[1].status.should.be.eql(secondUser.email);
                        done();
                    });
                });
            });
        });
    });
});
