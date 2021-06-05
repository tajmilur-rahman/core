const express = require('express');
const router = express.Router();
const { canActivate } = require('./middleware/auth-guard.middleware');
const LoginComponent = require('./component/public/login.component');
const SignupComponent = require('./component/public/signup.component');
const UserComponent = require('./component/private/user.component');
const OrderComponent = require('./component/private/order.component');

router.post('/auth/login', LoginComponent.authenticate);
router.post('/auth/signup', SignupComponent.createUser);
router.put('/auth/reset-password/:id', SignupComponent.resetPassword);
router.post('/auth/forget-password', SignupComponent.forgetPassword);
router.get('/users', canActivate(), UserComponent.getUsers);
router.get('/orders', canActivate(), OrderComponent.getAll);
router.post('/orders', canActivate(), OrderComponent.create);

module.exports = router;