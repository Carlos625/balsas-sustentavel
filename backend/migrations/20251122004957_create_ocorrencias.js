exports.up = function (knex) {
  return knex.schema.createTable('ocorrencias', function (table) {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE');
    table.string('tipo').notNullable();
    table.string('bairro').notNullable();
    table.string('logradouro').nullable();
    table.decimal('latitude', 10, 6).nullable();
    table.decimal('longitude', 10, 6).nullable();
    table.text('descricao').nullable();
    table.string('foto').nullable();
    table.enum('status', ['pendente', 'em_andamento', 'resolvido']).defaultTo('pendente');
    table.datetime('dataResolucao').nullable();
    table.string('observacoes').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ocorrencias');
};
