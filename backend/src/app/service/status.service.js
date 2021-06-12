const statusDao = require('../dao/status.dao');

module.exports = {
    getAll,
};

async function getAll(search = []) {
    const result = await statusDao.getAll(search);

    if (!result || result.length <= 0) {
        return [];
    }

    return result;
}
