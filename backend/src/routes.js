const express = require('express');
const AuthenticationController = require('./controllers/AuthenticationController');
const TimeZoneController = require('./controllers/TimeZoneController');
const UserController = require('./controllers/UserController');
const { authenticated } = require('./middlewares/protectedRoute');


const routes = express.Router();

routes.post('/auth/register', AuthenticationController.register)
routes.post('/auth/login', AuthenticationController.login)

routes.get('/users', authenticated, UserController.getAll)
routes.get('/users/:id', authenticated, UserController.getById)
routes.post('/users', authenticated, UserController.register)
routes.put('/users/:id', authenticated, UserController.update)
routes.delete('/users/:id', authenticated, UserController.delete)

routes.get('/timezones', authenticated, TimeZoneController.getAll)
routes.get('/timezones/:id', authenticated, TimeZoneController.getById)
routes.post('/timezones', authenticated, TimeZoneController.register)
routes.put('/timezones/:id', authenticated, TimeZoneController.update)
routes.delete('/timezones/:id', authenticated, TimeZoneController.delete)


module.exports = routes;