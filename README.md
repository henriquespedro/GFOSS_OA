...::: 1 - Criar tabela de registo de ocorrências ambientais :::...

CREATE TABLE fc_ocorrencias
(
  id serial NOT NULL,
  codigo_ocorrencia character varying(255) NOT NULL,
  nome_requerente character varying(255) NOT NULL,
  contacto character varying(255) NOT NULL,
  email_requerente character varying(255) NOT NULL,
  categoria_ocorrencia character varying(255) NOT NULL,
  descricao_ocorrencia character varying(255) NOT NULL,
  geom geometry(Point,3857),
  CONSTRAINT fc_ocorrencias_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);







...::: 2 - No ficheiro JS/init.js adicionar as layers que se pretende disponibilizar na LayerStore :::...

var LayersStore = [{layer: 'xptolayer', label: 'xptolabel', visible: true, group: 'xptogroup'}];




...::: 3 - Nos ficheiros PHP/pesquisas.php e PHP/ocorrencias/registo.php preencher com os dados de acesso à base de dados de PostGIS :::...





...::: 4 - No ficheiro PHP/ocorrencias/registo.php definir os dados para utilização do smtp :::...
