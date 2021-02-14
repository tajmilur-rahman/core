const moment = require('moment');

exports.up = function(knex) {
    return knex.schema
    .createTable('roles', function (table) {
        table.increments('id');
        table.string('name', 100);
        
        table.unique('name');

        table.engine('InnoDB');
        table.collate('utf8_unicode_ci');
    })
    .createTable('customers', function (table) {
        table.increments('id');
        table.string('name', 100);
        table.boolean('status').notNullable().defaultTo(true);
        table.integer('created_by').unsigned().notNullable();
        table.datetime('created_at').notNullable();
        table.integer('updated_by').unsigned();
        table.datetime('updated_at');
        table.integer('deleted_by').unsigned();
        table.datetime('deleted_at');
        
        table.unique('name');

        table.engine('InnoDB');
        table.collate('utf8_unicode_ci');
    })
    .createTable('technicians', function (table) {
        table.increments('id');
        table.string('name', 100);
        table.boolean('status').notNullable().defaultTo(true);
        table.integer('created_by').unsigned().notNullable();
        table.datetime('created_at').notNullable();
        table.integer('updated_by').unsigned();
        table.datetime('updated_at');
        table.integer('deleted_by').unsigned();
        table.datetime('deleted_at');
        
        table.unique('name');

        table.engine('InnoDB');
        table.collate('utf8_unicode_ci');
    })
    .createTable('vendors', function (table) {
        table.increments('id');
        table.string('name', 100);
        table.boolean('status').notNullable().defaultTo(true);
        table.integer('created_by').unsigned().notNullable();
        table.datetime('created_at').notNullable();
        table.integer('updated_by').unsigned();
        table.datetime('updated_at');
        table.integer('deleted_by').unsigned();
        table.datetime('deleted_at');
        
        table.unique('name');

        table.engine('InnoDB');
        table.collate('utf8_unicode_ci');
    })
    .createTable('users', function (table) {
       table.increments('id');
       table.string('username', 50).notNullable();
       table.string('password', 255).notNullable();
       table.string('name', 100).notNullable();
       table.string('email', 100).defaultTo('');
       table.integer('role_id').unsigned().notNullable();
       table.boolean('status').notNullable().defaultTo(true);
       table.integer('customer_id').unsigned();
       table.integer('technician_id').unsigned();
       table.integer('vendor_id').unsigned();
       table.integer('created_by').unsigned().notNullable();
       table.datetime('created_at').notNullable();
       table.integer('updated_by').unsigned();
       table.datetime('updated_at');
       table.integer('deleted_by').unsigned();
       table.datetime('deleted_at');

       table.unique('username');

       table.engine('InnoDB');
       table.collate('utf8_unicode_ci');
    })
    .alterTable('users', function(table) {
        table.foreign('role_id').references('roles.id');
        table.foreign('customer_id').references('customers.id');
        table.foreign('technician_id').references('technicians.id');
        table.foreign('vendor_id').references('vendors.id');
        table.foreign('created_by').references('users.id');
        table.foreign('updated_by').references('users.id');
        table.foreign('deleted_by').references('users.id');
    })
    .alterTable('customers', function(table) {
        table.foreign('created_by').references('users.id');
        table.foreign('updated_by').references('users.id');
        table.foreign('deleted_by').references('users.id');
    })
    .alterTable('technicians', function(table) {
        table.foreign('created_by').references('users.id');
        table.foreign('updated_by').references('users.id');
        table.foreign('deleted_by').references('users.id');
    })
    .alterTable('vendors', function(table) {
        table.foreign('created_by').references('users.id');
        table.foreign('updated_by').references('users.id');
        table.foreign('deleted_by').references('users.id');
    })
    .then(function() {
        return knex.insert([
            {
                name: 'Admin'
            },
            {
                name: 'Customer'
            },
            {
                name: 'Technician'
            },
            {
                name: 'Vendor'
            }
        ]).into('roles');
    })
    .then(function() {
        return knex.insert({
            username: 'admin',
            password: '$2a$10$FOnexOEbHrARSfCBE92ALeIxb7/XZKHtJ2o1g/gbG0.cOSuAmmSyi',
            name: 'Admin Admin',
            role_id: 1,
            created_by: 1,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).into('users');
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('roles')
    .dropTable('customers')
    .dropTable('technicians')
    .dropTable('vendors')
    .dropTable('users');
};
