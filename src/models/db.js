var Sequelize = require("sequelize");
var dotenv = require("dotenv");
dotenv.config();

var sequelize;
if (process.env.NODE_ENV == "test")
  sequelize = new Sequelize(
    process.env.TEST_DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      dialect: "postgres",
    }
  );
else if (process.env.NODE_ENV == "dev")
  sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      dialect: "postgres",
    }
  );
else
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

try {
  sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."));
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

try {
  process.env.NODE_ENV != "test" &&
    sequelize.sync().then(() => console.log("Successfully run the function"));
} catch (err) {
  console.log("Error: ", err);
}

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
