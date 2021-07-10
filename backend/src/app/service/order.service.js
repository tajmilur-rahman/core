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

async function create(data, id = 0) {
    const insert = data;
    insert.technician_id = (+data.technician_id > 0) ? +data.technician_id : null;
    insert.end_date = (data.end_date && data.end_time) ? data.end_date : null;
    insert.end_time = (data.end_date && data.end_time) ? data.end_time : null;

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

    return await ((+id > 0) ? orderDao.update(insert, id) : orderDao.create(insert));
}
