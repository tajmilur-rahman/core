const orderDao = require('../dao/order.dao');
const commonService = require('./common.service');

module.exports = {
    getAll,
    create,
};

async function getAll(params = [], isCountOnly = false) {
    const results = await orderDao.getAll(params, isCountOnly);
    return results;
}

async function create(data) {
    const insert = {
        customer_id: data.customer_id,
        technician_id: data.technician_id,
        status_id: data.status_id,
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        timezone: data.timezone,
        start_date: data.start_date,
        start_time: data.start_time,
        end_date: (data.end_date && data.end_time) ? data.end_date : null,
        end_time: (data.end_date && data.end_time) ? data.end_time : null,
        pay_type_id: data.pay_type_id,
        fixed_pay: data.fixed_pay,
        created_by: data.created_by,
        created_at: commonService.getCurrentDate(),
    };
    return await orderDao.create(insert);
}
