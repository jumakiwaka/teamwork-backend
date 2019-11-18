const app = require('../app');
const chai = require('chai'), expect = chai.expect, assert = chai.assert;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const db = require('../models/usingDb/db/index');
const dropTable = require('../db').dropTables;

const testRes = (res) => {
    const { body } = res;
    expect(body).to.contain.property('status');
    expect(body).to.contain.property('error');
    assert.equal(res.status, 400);
};

describe('Creating a new User', () => {
    describe('Should have all required properties in request body', () => {
        it('Should have a firstname property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });

        it('Should have a lastname property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });
        it('Should have an email property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "password": "nothingcanstopme",
                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });
        it('Should have a password property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "lastname": "Kiwaka",

                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });

        it('Should have a jobrole property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "lastname": "Kiwaka",

                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });
        it('Should have a department property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "lastname": "Kiwaka",

                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });
        it('Should have an address property', (done) => {
            request(app).post('/api/v1/auth/create-user')
                .send({
                    "firstName": "Juma",
                    "lastname": "Kiwaka",

                }).then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });

        });
    });
    describe('Ok, on succesful creation', function () {
        this.timeout(5000);
        describe('Should save new user to the database', () => {
            it('Should genereate a new token and send it to the client,', (done) => {
                request(app).post('/api/v1/auth/create-user').
                    send({
                        "firstName": "Juma",
                        "lastName": "Kiwaka",
                        "email": `jumakiwaka@teamwork.com`,
                        "password": "nothingcanstopme",
                        "gender": "male",
                        "jobRole": "CTO",
                        "department": "IT",
                        "address": "123, Juja street"
                    }).then(res => {

                        const { body } = res;
                        const { status, data } = body;
                        const { message, token, userId } = data;
                        const decoded_token = jwt.verify(token, 'RANDOM_SECRET_KEY');

                        expect(res.status).to.equal(201);
                        expect(status).to.equal('Success!');
                        expect(message).to.equal("user account created successfully");
                        expect(token).to.equal(token);
                        expect(userId).to.equal(decoded_token.userId);
                        //saving db
                        const text = `SELECT * FROM users where email=$1`;
                        db.query(text, [`jumakiwaka@teamwork.com`]).then(({ rows }) => {
                            if (!rows[0]) {
                                throw Error('User does not exist');
                            }
                            done();
                        }).catch(error => {
                            done(error);
                        })

                    }).catch(err => {
                        done(err);
                    })
            });
        });
    });
});