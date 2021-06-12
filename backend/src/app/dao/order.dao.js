const knex = require('../database/knexfile').knex;

module.exports = {
    getAll,
    create,
};

async function getAll(params = [], isCountOnly = false)
{
    const select = isCountOnly ? knex.raw('COUNT(o.id) AS totalCount') : knex.raw(`o.id, o.title, o.customer_id AS customerId, c.name AS customerName, o.status_id AS statusId, s.name AS statusName, o.address AS location, CONCAT(o.start_date, ' ', o.start_time) as schedule, o.technician_id AS technicianId, t.name AS technicianName`);
    const query = knex.select(select)
        .from('orders as o')
        .leftJoin('customers AS c', 'c.id', 'o.customer_id')
        .leftJoin('statuses AS s', 's.id', 'o.status_id')
        .leftJoin('users AS t', 't.id', 'o.technician_id')
        .orderBy('o.id', 'asc');

    params.forEach(param => {
        query.where(param.field, param.condition, param.value);
    });
    return await query;
}

async function create(params)
{
    const query = knex('orders').insert(params, 'id').then(result => {
        return result[0];
    });
    return await query;
}
