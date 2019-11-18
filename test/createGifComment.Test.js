const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const db = require('../models/usingDb/db/index');

const app = require('../app');

describe('Commenting a gif', function(){
    this.timeout(5000);
    describe('given the user has logged in,', () => {
        describe('should save the comment to the database', () => {
            it('should send a successfull response back to user', (done) => {
                
                const findAllQuery = 'SELECT * FROM gifs';
                db.query(findAllQuery)
                .then(({rows}) => {
                    const {id} = rows[0];
                    request(app).post('/api/v1/auth/signin')
                .send({
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme"
                })
                .then(res => {
                    const { body } = res;
                    const { status, data } = body;
                    const { token, userId } = data;
                request(app).post(`/api/v1/resources/gifs/${id}/comment`)
                .send({
                    "comment" : "You are welcome!",                    
                    "userId" : `${userId}`
                })                    
                .set('Authorization', `app ${token}`)
                .then(res => {
                    const {body} = res;                        
                    
                    const {status, data} = body;
                    const {message, gifTitle, comment} = data;
                    expect(res.status).to.equal(201);
                    expect(status).to.equal("success");
                    expect(message).to.equal("Comment successfully created");                        
                    expect(gifTitle).to.equal(rows[0].title);                    
                    expect(comment).to.equal('You are welcome!');
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
});