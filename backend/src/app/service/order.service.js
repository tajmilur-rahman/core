const orderDao = require('../dao/order.dao');
const commonService = require('./common.service');

module.exports = {
    getAll,
    create,
};

async function getAll(params = [], isCountOnly = false, sort = null, offset = null, limit = null) {
    const results = await orderDao.getAll(params, isCountOnly, sort, offset, limit);
    return results;
}

async function create(data) {
    const insert = {
        customer_id: +data.customer_id,
        technician_id: (+data.technician_id > 0) ? +data.technician_id : null,
        status_id: +data.status_id,
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
        pay_type_id: +data.pay_type_id,
        fixed_pay: +data.fixed_pay,
        per_hour: +data.per_hour,
        max_hour: +data.max_hour,
        per_device: +data.per_device,
        max_device: +data.max_device,
        created_by: +data.created_by,
        created_at: commonService.getCurrentDate(),
    };

    if (+insert.pay_type_id > 0) {
        if (+insert.pay_type_id === 1) {
            insert.per_hour = 0;
            insert.max_hour = 0;
            insert.per_device = 0;
            insert.max_device = 0;
        }
    
        if (+insert.pay_type_id === 2) {
            insert.fixed_pay = 0;
            insert.per_device = 0;
            insert.max_device = 0;
        }

        if (+insert.pay_type_id === 3) {
            insert.fixed_pay = 0;
            insert.per_hour = 0;
            insert.max_hour = 0;
        }

        if (+insert.pay_type_id === 4) {
            insert.fixed_pay = 0;
        }
    }

    return await orderDao.create(insert);
}
