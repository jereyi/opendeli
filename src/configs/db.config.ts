import { Sequelize } from "sequelize";

// Option 1: Passing a connection URI
// TODO: Set up database
const sequelize = new Sequelize(process.env.DB_URI || "sqlite::memory:"); // Example for postgres

// Option 2: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
try {
  sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."));
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
