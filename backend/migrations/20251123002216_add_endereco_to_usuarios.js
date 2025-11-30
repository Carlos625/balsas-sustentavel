exports.up = function(knex) {
  return knex.schema.table('usuarios', function(table) {
    table.string('rua').nullable();
    table.string('numero').nullable();
    table.string('bairro').nullable();
    table.string('cidade').defaultTo('Balsas');
    table.string('estado').defaultTo('MA');
    table.string('cep').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('usuarios', function(table) {
    table.dropColumn('rua');
    table.dropColumn('numero');
    table.dropColumn('bairro');
    table.dropColumn('cidade');
    table.dropColumn('estado');
    table.dropColumn('cep');
  });
};
