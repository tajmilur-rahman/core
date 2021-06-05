const customerDao = require('../dao/customer.dao');
const commonService = require('./common.service');

module.exports = {
    createCustomer,
};

async function createCustomer(data) {
    const createData = {
        name: data.name,
        created_by: data.user_id,
        created_at: commonService.getCurrentDate(),
    };
    return await customerDao.createCustomer(createData);
}