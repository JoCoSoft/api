## Getting Started

1. Clone repo

   `git clone https://github.com/JoCoSoft/api`

2. Install dependencies (install [yarn](https://yarnpkg.com/en/) if you don't have it)

   `yarn`

3. Setup the database

   This can be done by running `bin/reset-devdb` if `postgresql` along with the `dropdb` and `createdb` commands are installed. If not, create a database named `jocosoft-api` and run sequelize migration via `node_modules/.bin/sequelize`.

## Sequelize

Resetting the development database: `bin/reset-devdb`.

Use `node_modules/.bin/sequelize` to see the available commands.

#### Migrations

Add new migration:
`node_modules/.bin/sequelize migration:generate --name NAME_OF_MIGRATION`

Run pending migrations: `node_modules/.bin/sequelize db:migrate`

Undo last migration (run down script): `node_modules/.bin/sequelize db:migrate:undo`
