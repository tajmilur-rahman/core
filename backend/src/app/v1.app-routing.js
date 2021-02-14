const express = require('express');
const router = express.Router();
const { canActivate } = require('./middleware/auth-guard.middleware');
const LoginComponent = require('./component/public/login.component');
const UserComponent = require('./component/private/user.component');

router.post('/auth/login', LoginComponent.authenticate);
router.get('/users', canActivate(), UserComponent.getUsers);

module.exports = router;