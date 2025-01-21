
exports.up = function(knex) {
    return knex.schema.createTable('all_nfse', table => {
          table.increments('id').primary(),

          table.string('municipio', 800).nullable(),
          table.string('serie', 800).nullable(),
          table.bigInteger('num_rps').nullable(),
          table.bigInteger('num_nfse').nullable(),
          table.string('cnpj_prestador', 800).nullable(),
          table.string('cnpj_tomador', 800).nullable(),
          table.string('prestador', 800).nullable(),
          table.string('tomador', 800).nullable(),
          table.string('valor_iss', 800).nullable(),
          table.string('valor_servicos', 800).nullable(),
          table.string('base_calculo', 800).nullable(),
          table.string('aliquota', 800).nullable(),
          table.string('valor_liquido_nfse', 800).nullable(),
          table.string('valor_total_tributos_federais', 800).nullable(),
          table.string('valor_total_tributos_estaduais', 800).nullable(),
          table.string('valor_total_tributos_municipais', 800).nullable(),
          table.string('chave_acesso', 800).nullable(),
          table.string('descricao', 5000).nullable(),
          table.string('end_prestador', 2000).nullable(),
          table.string('status', 800).nullable(),
          table.timestamp('ref_dataEmissao').nullable(),
          table.bigInteger('ref_numeroRPS').nullable(),
          table.bigInteger('ref_numeroNfse').nullable(),
          table.timestamp('created_at').defaultTo(knex.fn.now()),
          table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('all_nfse')
};
