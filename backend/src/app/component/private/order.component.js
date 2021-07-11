const Joi = require('@hapi/joi');
const orderService = require('../../service/order.service');
const commonService = require('../../service/common.service');
const countryTimezone = require('../../constant/country-timezone');

module.exports = {
    getAll,
    create,
    getCountryTimezone,
    changeStatus,
    createRequestOrder,
    requestOrderList,
    assignTech,
};

async function getCountryTimezone(req, res, next)
{
    res.json({
        totalCount: countryTimezone.length,
        result: countryTimezone,
    });
}

async function getAll(req, res, next)
{
    let {search, sort, offset, limit} = req.query;

    if (!search) {
        search = {};
    }

    if (!sort) {
        sort = {
            field: 'o.id',
            direction: 'asc'
        };
    }

    if (!offset) {
        offset = 0;
    }

    if (!limit) {
        limit = 10;
    }

    if (req.user.role_id === 2) {
        search['customer_id'] = {
            condition: 'in',
            value: [req.user.customer_id],
        };
        search['status_id'] = {
            condition: 'in',
            value: [1, 2, 3, 4, 5, 6],
        };
    } else if (req.user.role_id === 3) {
        search['is_technician'] = {
            id: +req.user.id,
        };
    }

    const totalCountResult = await orderService.getAll(search, true);
    const result = await orderService.getAll(search, false, sort, offset, limit);
    res.json({
        totalCount: totalCountResult[0].totalCount,
        result: result,
    });
}

async function requestOrderList(req, res, next) {
    let {search, sort, offset, limit} = req.query;

    if (!search) {
        search = {};
    }

    if (!sort) {
        sort = {
            field: 'o.id',
            direction: 'asc'
        };
    }

    if (!offset) {
        offset = 0;
    }

    if (!limit) {
        limit = 10;
    }

    const totalCountResult = await orderService.getAllRequest(search, true);
    const result = await orderService.getAllRequest(search, false, sort, offset, limit);
    res.json({
        totalCount: totalCountResult[0].totalCount,
        result: result,
    });
}

async function changeStatus(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().required(),
        status_id: Joi.number().integer().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    if (
        (req.user.role_id === 1 && [1, 2, 3, 4, 6, 7, 8].indexOf(value.status_id) === -1)
        || (req.user.role_id === 2 && [1, 2, 3, 4, 6, 8].indexOf(value.status_id) === -1)
        || (req.user.role_id === 3 && [5].indexOf(value.status_id) === -1)
    ) {
        next(`You are not permitted to change this status`);
        return false;
    }

    let id = (+value.id > 0) ? +value.id : 0;
    delete value['id'];
    let message = ``;
    value.updated_by = req.user.id;
    value.updated_at = commonService.getCurrentDate();
    id = await orderService.create(value, id);
    message = `Order status changed successfully`;

    res.json({
        success: true,
        message: message,
        data: id,
    });
}

async function createRequestOrder(req, res, next) {
    const schema = Joi.object({
        order_id: Joi.number().integer().required(),
        flag: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    if (+req.user.role_id !== 3) {
        next(`You are permitted to request this order`);
        return false;
    }

    const order = await orderService.getAll({
        id: {
            condition: '=',
            value: +value.order_id,
        },
        is_technician: {
            id: +req.user.id,
        }
    });
    if (+order[0].statusId !== 2 || (value.flag === 'cancel' && +order[0].orderRequestId === 0)) {
        next(`You are permitted to request this order`);
        return false;
    }

    const flag = value.flag;
    value.technician_id = +req.user.id;
    value.created_at = commonService.getCurrentDate();
    const id = (flag === 'cancel') ? await orderService.deleteRequest(value) : await orderService.createRequest(value);

    res.json({
        success: true,
        message: (flag === 'cancel') ? `Request canceled successfully` : `Order requested successfully`,
        data: id,
    });
}

async function create(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().optional().allow(null, "", 0),
        customer_id: Joi.number().integer().required(),
        technician_id: Joi.number().integer().optional().allow(null, ""),
        status_id: Joi.number().integer().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
        timezone: Joi.string().optional().allow(null, ""),
        start_date: Joi.string().required(),
        start_time: Joi.string().required(),
        end_date: Joi.string().optional().allow(null, ""),
        end_time: Joi.string().optional().allow(null, ""),
        pay_type_id: Joi.number().required(),
        fixed_pay: Joi.number().optional().allow(null, ""),
        per_hour: Joi.number().optional().allow(null, ""),
        max_hour: Joi.number().optional().allow(null, ""),
        per_device: Joi.number().optional().allow(null, ""),
        max_device: Joi.number().optional().allow(null, ""),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    if (req.user.role_id === 2) {
        value.customer_id = req.user.customer_id;
    }

    let id = (+value.id > 0) ? +value.id : 0;
    delete value['id'];
    let message = ``;
    if (id > 0) {
        value.updated_by = req.user.id;
        value.updated_at = commonService.getCurrentDate();
        await orderService.create(value, id);
        message = `Order updated successfully`;
    } else {
        value.created_by = req.user.id;
        value.created_at = commonService.getCurrentDate();
        id = await orderService.create(value);
        message = `Order created successfully`;
    }

    if (+value.status_id > 0 && [1, 2, 4, 8].indexOf(+value.status_id) !== -1) {
        await orderService.deleteRequestByOrderId({
            order_id: +id,
        });
    }

    res.json({
        success: true,
        message: message,
        data: id,
    });
}

async function assignTech(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().required(),
        technician_id: Joi.number().integer().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    if (
        (req.user.role_id === 1 && [2].indexOf(value.status_id) !== -1)
        || (req.user.role_id === 2 && [2].indexOf(value.status_id) !== -1)
        || req.user.role_id === 3
    ) {
        next(`You are not permitted to change this status`);
        return false;
    }

    let id = (+value.id > 0) ? +value.id : 0;
    const data = {
        status_id: 4,
        technician_id: +value.technician_id,
    };
    data.updated_by = req.user.id;
    data.updated_at = commonService.getCurrentDate();
    await orderService.create(data, id);
    await orderService.deleteRequestByOrderId({
        order_id: +id,
    });
    let message = `Order assigned successfully`;

    res.json({
        success: true,
        message: message,
        data: id,
    });
}
