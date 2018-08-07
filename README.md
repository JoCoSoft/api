## Sequelize

Resetting the development database: `bin/reset-devdb`.

Use `node_modules/.bin/sequelize` to see the available commands.

#### Migrations

Add new migration:
`node_modules/.bin/sequelize migration:generate --name NAME_OF_MIGRATION`

Run pending migrations: `node_modules/.bin/sequelize db:migrate`

Undo last migration (run down script): `node_modules/.bin/sequelize db:migrate:undo`
