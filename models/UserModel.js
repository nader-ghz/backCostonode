import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    firstname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
           // len: [3, 100]
        }
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            //len: [3, 100]
        }
    },
    gender:{
        type: DataTypes.STRING,
       // allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    birthday:{
        type: DataTypes.DATE,
        validate:{
            notEmpty: true,
        }
    },
    numTel:{
        type: DataTypes.STRING,
       // allowNull: false,
        validate:{
            notEmpty: true,
            len: [8]
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    profilePicture: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        defaultValue: null 
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Default value is active
    }
},{
    freezeTableName: true
});

export default Users;