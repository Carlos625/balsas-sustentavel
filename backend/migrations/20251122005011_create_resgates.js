exports.up = function (knex) {
  return knex.schema.createTable('resgates', function (table) {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE');
    table.string('parceiro').notNullable();
    table.integer('pontos_utilizados').notNullable();
    table.decimal('valor_resgate', 10, 2).notNullable();
    table.enum('status', ['pendente', 'utilizado', 'cancelado']).defaultTo('pendente');
    table.string('codigo').notNullable().unique();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('resgates');
};
