const express = require('express');
const router = express.Router();
const AuthGuardService = require('../app/service/auth-guard.service');
const LoginComponent = require('./component/public/login.component');
const UserComponent = require('./component/private/user.component');

router.post('/auth/login', LoginComponent.authenticate);
router.get('/users', AuthGuardService.canActivate(), UserComponent.getUsers);

module.exports = router;