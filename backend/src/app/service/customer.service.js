const customerDao = require('../dao/customer.dao');
const commonService = require('./common.service');

module.exports = {
    createCustomer,
    getAll,
};

async function createCustomer(data) {
    const createData = {
        name: data.name,
        created_by: data.user_id,
        created_at: commonService.getCurrentDate(),
    };
    return await customerDao.createCustomer(createData);
}

async function getAll(search = []) {
    const result = await customerDao.getAll(search);

    if (!result || result.length <= 0) {
        return [];
    }

    return result;
}
