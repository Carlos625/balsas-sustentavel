exports.up = function (knex) {
  return knex.schema.createTable('usuarios', function (table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    table.string('telefone').nullable();
    table.string('endereco').nullable();
    table.integer('pontos').defaultTo(0);
    table.enum('role', ['usuario', 'admin']).defaultTo('usuario');
    table.boolean('ativo').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuarios');
};
