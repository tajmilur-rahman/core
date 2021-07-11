const knex = require('../database/knexfile').knex;

module.exports = {
    getAll,
    create,
    update,
    createRequest,
    deleteRequest,
    deleteRequestByOrderId,
    getAllRequest,
};

async function getAllRequest(search = [], isCountOnly = false, sort = null, offset = null, limit = null)
{
    const columnMap = {
        technician_id: 'o.technician_id',
        order_id: 'o.order_id',
    };
    let select = isCountOnly ? `COUNT(o.id) AS totalCount` : `o.id, o.order_id AS orderId, o.technician_id AS technicianId, t.name AS technicianName, o.created_at AS createdAt`;
    const query = knex.select(knex.raw(select))
        .from('order_requests as o')
        .leftJoin('users AS t', 't.id', 'o.technician_id')
        .orderBy('o.id', 'asc');

    Object.keys(search).forEach(field => {
        query.where(columnMap[field], search[field].condition, search[field].value);
    });

    if (sort) {
        query.orderBy(sort.field, sort.direction);
    }

    if (+limit > 0) {
        query.limit(+limit);
    }

    if (+offset > 0 && +limit > 0) {
        query.offset(+offset * +limit);
    }
    return await query;
}

async function getAll(search = [], isCountOnly = false, sort = null, offset = null, limit = null)
{
    const columnMap = {
        customer_id: 'o.customer_id',
        technician_id: 'o.technician_id',
        id: 'o.id',
        status_id: 'o.status_id',
    };
    let select = isCountOnly ? `COUNT(o.id) AS totalCount` : `o.id, o.title, o.description, o.customer_id AS customerId, c.name AS customerName, o.status_id AS statusId, s.name AS statusName, o.address AS address, o.city AS city, o.state AS state, o.zip, o.country, CONCAT(o.start_date) AS startDate, o.start_time AS startTime, CONCAT(o.start_date, ' ', o.start_time) AS startDateTime, CONCAT(o.end_date) AS endDate, o.end_time AS endTime, CONCAT(o.end_date, ' ', o.end_time) AS endDateTime, o.technician_id AS technicianId, o.timezone, t.name AS technicianName, o.pay_type_id AS payTypeId, o.fixed_pay AS fixedPay, o.per_hour AS perHour, o.max_hour AS maxHour, o.per_device AS perDevice, o.max_device AS maxDevice, oReq.id AS orderRequestId`;
    const query = knex.select(knex.raw(select))
        .from('orders as o')
        .leftJoin('customers AS c', 'c.id', 'o.customer_id')
        .leftJoin('statuses AS s', 's.id', 'o.status_id')
        .leftJoin('users AS t', 't.id', 'o.technician_id')
        .joinRaw(`LEFT JOIN order_requests AS oReq ON (oReq.order_id = o.id AND oReq.technician_id = ${(search.hasOwnProperty('is_technician')) ? +search['is_technician'].id : 0})`);

    Object.keys(search).forEach(field => {
        if (field === 'is_technician') {
            query.whereRaw(` (
                (o.status_id IN (4, 5, 6) AND o.technician_id = ${+search[field].id})
                OR (o.status_id = 2)
            ) `);
        } else {
            query.where(columnMap[field], search[field].condition, search[field].value);
        }
    });

    if (sort && sort.field && sort.direction && columnMap[sort.field]) {
        query.orderBy(columnMap[sort.field], sort.direction);
    } else {
        query.orderBy('o.id', 'asc');
    }

    if (+limit > 0) {
        query.limit(+limit);
    }

    if (+offset > 0 && +limit > 0) {
        query.offset(+offset * +limit);
    }console.log(query.toQuery())
    return await query;
}

async function create(params)
{
    const query = knex('orders').insert(params, 'id').then(result => {
        return result[0];
    });
    return await query;
}

async function update(params, id)
{
    const query = knex('orders').update(params).where('id', id).then(result => {
        return id;
    });
    return await query;
}

async function createRequest(params)
{
    const query = knex('order_requests').insert(params, 'id').then(result => {
        return result[0];
    });
    return await query;
}

async function deleteRequest(params)
{
    const query = knex('order_requests').where({
        order_id: +params.order_id,
        technician_id: +params.technician_id,
    }).del();
    return await query;
}

async function deleteRequestByOrderId(params)
{
    const query = knex('order_requests').where({
        order_id: +params.order_id,
    }).del();
    return await query;
}
