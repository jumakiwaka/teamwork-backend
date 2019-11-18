const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const db = require('../models/usingDb/db/index');

const app = require('../app');

describe('Getting a gif', function () {
    this.timeout(5000);
    describe('given the user has logged in,', () => {
        it('should send a successfull response back to user', (done) => {

            const findAllQuery = 'SELECT * FROM gifs';
            db.query(findAllQuery)
                .then(({ rows }) => {
                    const { id } = rows[0];

                    request(app).post('/api/v1/auth/signin')
                        .send({
                            "email": "jumakiwaka@teamwork.com",
                            "password": "nothingcanstopme"
                        })
                        .then(res => {
                            const { body } = res;
                            const { status, data } = body;
                            const { token, userId } = data;
                            request(app).get(`/api/v1/resources/gifs/${id}`)
                                .send({
                                    "userId": `${userId}`
                                })
                                .set('Authorization', `app ${token}`)
                                .then(res => {
                                    const { body } = res;
                                   
    
                                    const { status, data } = body;
                                    
                                    
                                    expect(res.status).to.equal(200);
                                    expect(data).to.be.an('Object');
                                    expect(status).to.equal('success');
                                    expect(data.comments).to.be.an('Array');
                                    expect(data.comments[0]).to.be.an('Object');
                                    done();
                                }).catch(error => {
                                    done(error);
                                });

                        })
                        .catch(error => {
                            console.log('error');
                            done(error);
                        });

                })
                .catch(err => {
                    done(err);
                });


        });

    });
});