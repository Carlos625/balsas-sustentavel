exports.up = function (knex) {
  return knex.schema.createTable('entregas', function (table) {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE');
    table.enum('tipoResiduo', ['latinhas', 'plastico', 'papel', 'vidro', 'metal', 'eletronicos']).notNullable();
    table.decimal('peso', 10, 2).notNullable();
    table.enum('postoColeta', ['centro', 'jk', 'caic', 'camara']).notNullable();
    table.enum('horario', ['manha', 'tarde']).notNullable();
    table.date('dataEntrega').notNullable();
    table.integer('pontosGanhos').defaultTo(0);
    table.enum('status', ['agendado', 'confirmado', 'cancelado', 'concluido']).defaultTo('agendado');
    table.string('observacoes').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('entregas');
};
