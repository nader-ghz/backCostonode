import {Sequelize} from "sequelize";

const db = new Sequelize('costoecommercenodejs', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;