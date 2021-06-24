const knex = require('../database/knexfile').knex;

module.exports = {
    getAll,
    create,
};

async function getAll(search = [], isCountOnly = false, sort = null, offset = null)
{
    const columnMap = {
        customer_id: 'o.customer_id',
    };
    const select = isCountOnly ? knex.raw('COUNT(o.id) AS totalCount') : knex.raw(`o.id, o.title, o.customer_id AS customerId, c.name AS customerName, o.status_id AS statusId, s.name AS statusName, o.address AS address, o.city AS city, o.state AS state, CONCAT(o.start_date) AS startDate, o.start_time AS startTime, CONCAT(o.start_date, ' ', o.start_time) AS startDateTime, CONCAT(o.end_date) AS endDate, o.end_time AS endTime, CONCAT(o.end_date, ' ', o.end_time) AS endDateTime, o.technician_id AS technicianId, t.name AS technicianName`);
    const query = knex.select(select)
        .from('orders as o')
        .leftJoin('customers AS c', 'c.id', 'o.customer_id')
        .leftJoin('statuses AS s', 's.id', 'o.status_id')
        .leftJoin('users AS t', 't.id', 'o.technician_id')
        .orderBy('o.id', 'asc');

    Object.keys(search).forEach(field => {
        query.where(columnMap[field], search[field].condition, search[field].value);
    });

    if (offset) {
        //
    }
    return await query;
}

async function create(params)
{
    const query = knex('orders').insert(params, 'id').then(result => {
        return result[0];
    });
    return await query;
}
