const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const db = require('../models/usingDb/db/index');

const app = require('../app');

describe('Deleting an gif', function(){
    this.timeout(5000);
    describe('given the user has logged in,', () => {
        describe('And has created the gif', () => {
            describe('should delete the gif from the database', () => {
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
                    request(app).delete(`/api/v1/resources/gifs/${id}`)
                    .send({                        
                        "userId" : userId
                    })                    
                    .set('Authorization', `app ${token}`)
                    .then(res => {
                        const {body} = res;                        
                                                
                        const {status, data} = body;
                        const {message} = data;
                        expect(res.status).to.equal(200);
                        expect(status).to.equal("success");
                        expect(message).to.equal("gif post successfully deleted");                     
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
});