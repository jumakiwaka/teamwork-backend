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
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })
        });

        it('Should have a lastname property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                   
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })

        });
        it('Should have an email property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",                   
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })

        });
        it('Should have a password property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",                    
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })

        });

        it('Should have a jobrole property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })

        });
        it('Should have a department property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })
        });
        it('Should have an address property', (done) => {
            request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email" : "juju@admin.com",
                "password" : "nothingcanstopme",
            })
            .then(res => {
                const { body } = res;
                const { status, data } = body;
                const { token, userId } = data;
                request(app).post('/api/v1/auth/create-user')
                .send({
                    "lastName": "Kiwaka",
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme",
                    "userId" : userId
                })
                .set("Authorization" , `app ${token}`)
                .then(res => {
                    testRes(res);
                    done();
                }).catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            })
        });
    });
    describe('Given user is an admin', function () {
        this.timeout(5000);
        describe('Should save new user to the database', () => {
            it('Should genereate a new token and send it to the client,', (done) => {
                request(app).post('/api/v1/auth/signin')
                    .send({
                        "email": "juju@admin.com",
                        "password": "nothingcanstopme"
                    })
                    .then(res => {
                        const { body } = res;
                        const { status, data } = body;
                        const { token, userId } = data;
                        request(app).post('/api/v1/auth/create-user').
                            send({
                                "firstName": "Juma",
                                "lastName": "Kiwaka",
                                "email": `jumakiwaka@teamwork.com`,
                                "password": "nothingcanstopme",
                                "gender": "male",
                                "jobRole": "CTO",
                                "department": "IT",
                                "address": "123, Juja street",
                                "userId" : userId
                            })
                            .set('Authorization', `app ${token}`)
                            .then(res => {

                                const { body } = res;
                                console.log(body);
                                
                                const { status, data } = body;
                                const { token, userId } = data;
                                const decoded_token = jwt.verify(token, 'jujucrafteee');
                                const jwt_token = jwt.sign({ userId: userId }, 'jujucrafteee', { expiresIn: '24h' })

                                expect(res.status).to.equal(201);
                                expect(status).to.equal('Success!');
                                expect(token).to.equal(jwt_token);
                                expect(userId).to.equal(decoded_token.userId);
                                done();
                            })
                            .catch(error => {
                                console.log('error');
                                done(error);
                            });

                    })
                    .catch(error => {
                        console.log('error');
                        done(error);
                    });

            });
        });
    });
});