'use strict';
var Test = require('tape');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var Path = require('path');
var Request = require('supertest');
var Mockgen = require('../../../data/mockgen.js');
var Parser = require('swagger-parser');
/**
 * Test for /service/{id}/start
 */
Test('/service/{id}/start', function (t) {
    var apiPath = Path.resolve(__dirname, '../../../config/swagger.yaml');
    var App = Express();
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({
        extended: true
    }));
    App.use(Swaggerize({
        api: apiPath,
        handlers: Path.resolve(__dirname, '../../../handlers')
    }));
    Parser.validate(apiPath, function (err, api) {
        t.error(err, 'No parse error');
        t.ok(api, 'Valid swagger api');
        /**
         * summary: 
         * description: Start training &#39;Service&#39; specs in the system.
         * parameters: id
         * produces: 
         * responses: 201, default
         */
        t.test('test startTrainingService put operation', function (t) {
            Mockgen().requests({
                path: '/service/{id}/start',
                operation: 'put'
            }, function (err, mock) {
                var request;
                t.error(err);
                t.ok(mock);
                t.ok(mock.request);
                //Get the resolved path from mock request
                //Mock request Path templates({}) are resolved using path parameters
                request = Request(App)
                    .put('' + mock.request.path);
                if (mock.request.body) {
                    //Send the request body
                    request = request.send(mock.request.body);
                } else if (mock.request.formData){
                    //Send the request form data
                    request = request.send(mock.request.formData);
                    //Set the Content-Type as application/x-www-form-urlencoded
                    request = request.set('Content-Type', 'application/x-www-form-urlencoded');
                }
                // If headers are present, set the headers.
                if (mock.request.headers && mock.request.headers.length > 0) {
                    Object.keys(mock.request.headers).forEach(function (headerName) {
                        request = request.set(headerName, mock.request.headers[headerName]);
                    });
                }
                request.end(function (err, res) {
                    t.error(err, 'No error');
                    t.ok(res.statusCode === 201, 'Ok response status');
                    t.end();
                });
            });
        });
    });
});
