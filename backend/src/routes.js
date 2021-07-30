const express = require('express');
const AuthenticationController = require('./controllers/AuthenticationController');
const TimeZoneController = require('./controllers/TimeZoneController');
const UserController = require('./controllers/UserController');
const { authenticated } = require('./middlewares/protectedRoute');
const { validator } = require('./middlewares/validator');

const AuthenticationSchema = require('./validators/AuthenticationSchema');
const TimeZoneSchema = require('./validators/TimeZoneSchema');
const UserSchema = require('./validators/UserSchema');

const routes = express.Router();

routes.post('/auth/register', validator(AuthenticationSchema.register), AuthenticationController.register)
routes.post('/auth/login', validator(AuthenticationSchema.login), AuthenticationController.login)

routes.get('/users', authenticated, validator(UserSchema.getAll), UserController.getAll)
routes.get('/users/:id', authenticated, validator(UserSchema.getById), UserController.getById)
routes.post('/users', authenticated, validator(UserSchema.register), UserController.register)
routes.put('/users/:id', authenticated, validator(UserSchema.update), UserController.update)
routes.delete('/users/:id', authenticated, validator(UserSchema.delete), UserController.delete)

routes.get('/timezones', authenticated, validator(TimeZoneSchema.getAll), TimeZoneController.getAll)
routes.get('/timezones/:id', authenticated, validator(TimeZoneSchema.getById), TimeZoneController.getById)
routes.post('/timezones', authenticated, validator(TimeZoneSchema.register), TimeZoneController.register)
routes.put('/timezones/:id', authenticated, validator(TimeZoneSchema.update), TimeZoneController.update)
routes.delete('/timezones/:id', authenticated, validator(TimeZoneSchema.delete), TimeZoneController.delete)


module.exports = routes;