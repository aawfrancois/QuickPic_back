const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../index');
const todoItem = require('../models/user');
const TodoItem = mongoose.model('TodoItem', todoItem);

chai.use(chaiHttp);

describe('TodoList', () => {
    beforeEach((done) => {
        TodoItem.remove({}, () => { // On vide la base de données avant chaque test
            done(); // Etant donné que la méthode remove est asynchrone, done est utilisé pour que mocha sache quand tout est terminé
        });
    });

    describe('/GET todoitems', () => { // La suite de tests pour la route GET
        it('should get all todo items when no items are in database', (done) => { // Test qui vérifie qu'il n'y a pas d'erreurs lorsque la base de données est vide
            chai.request(server).get('/todoitems').end((err, res) => { // On requète la route GET
                res.should.have.status(200); // On vérifie le statu de la réponse
                res.body.should.be.a('array'); // On vérifie que le résultat est un tableau
                res.body.length.should.be.eql(0); // On vérifie que la longueur du tableau est de 0
                done(); // On dit à mocha que l'on a fini nos assertions
            });
        });

        it('should get all todo items when there are two items in the database', (done) => { // Test qui vérifie qu'on a le bon résultat lorsqu'il y a deux items dans la base de données
            const firstTodoItem = new TodoItem({
                name: 'firstTask',
                status: 'inProgress'
            });
            const secondTodoItem = new TodoItem({
                name: 'secondTask',
                status: 'done'
            });
            firstTodoItem.save(() => { // On sauvegarde les items dans la base de données
                secondTodoItem.save(() => {
                    chai.request(server).get('/todoitems').end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        res.body[0].name.should.be.eql(firstTodoItem.name); // On vérifie que les éléments retournés par la route sont semblables à ceux que l'on a enregistré dans la base
                        res.body[0].status.should.be.eql(firstTodoItem.status);
                        res.body[1].name.should.be.eql(secondTodoItem.name);
                        res.body[1].status.should.be.eql(secondTodoItem.status);
                        done();
                    });
                });
            });
        });
    });
});
