const assert = require('assert');
const authService = require('../services/authService');
const request = require('supertest');
const app = require('../server');
require('../config/db');

let url= 'http://localhost:4000';

    test('should check email id', (done) => {
        request(url)
            .post('/v1/auth/register')
            .send({
                email: 'subhro.rj@gmail.com',
                password:'String#$123'
            })
            .expect(201)
            done();
    });

