const Joi = require('@hapi/joi');
const validateRequest = require('../../middleware/validate-request.middleware');
const userService = require('../../service/user.service');
const customerService = require('../../service/customer.service');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser,
    resetPassword,
    forgetPassword,
};

async function createUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone_number: Joi.string().required(),
        role_id: Joi.number().required(),
        company_name: Joi.string().optional().allow(null, ""),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    // create user
    const user = await userService.createUser(value);
    const userId = +user[0];

    // create company
    const userDataToUpdate = {
        created_by: userId,
        password_verification_code: bcrypt.genSaltSync((new Date()).getSeconds())
    };
    if (userId && +value.role_id === 2 && value.company_name) {
        const customer = await customerService.createCustomer({
            name: value.company_name,
            user_id: userId,
        });

        userDataToUpdate['customer_id'] = +customer[0];
    }

    await userService.updateUser(userDataToUpdate, {
        id: userId
    });

    res.json(true);
}

async function resetPassword(req, res, next) {
    const schema = Joi.object({
        new_password: Joi.string().required(),
        confirm_password: Joi.string().required(),
        password_verification_code: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    const userId = +req.params.id;

    // search user
    const user = await userService.getById(userId);

    if (!user) {
        next(`User not found`);
        return false;
    }

    if (user.password_verification_code !== value.password_verification_code) {
        next(`Verification code doesn't match`);
        return false;
    }

    // update user
    const userDataToUpdate = {
        password: bcrypt.hashSync(value.new_password),
        password_verification_code: null
    };

    await userService.updateUser(userDataToUpdate, {
        id: userId
    });

    res.json(true);
}

async function forgetPassword(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    // search user
    const user = await userService.getUsers([
        {
            field: 'email',
            value: value.email,
            condition: '='
        }
    ]);

    if (!user) {
        next(`User not found`);
        return false;
    }

    // update user
    const userDataToUpdate = {
        password_verification_code: bcrypt.genSaltSync((new Date()).getSeconds())
    };

    await userService.updateUser(userDataToUpdate, {
        id: user[0].id
    });

    res.json(true);
}
