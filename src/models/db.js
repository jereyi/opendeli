var Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "postgres",
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    dialect: "postgres",
  }
);

try {
  sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."));

  sequelize.sy;
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// try {
//   sequelize.sync().then(() => console.log("Successfully run the function"));
// } catch (err) {
//   console.log("Error: ", err);
// }

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
