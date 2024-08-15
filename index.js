import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import productRouter from './routes/product.routes.js';

import UserRoute from "./routes/UserRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

//  (async()=>{
//     await db.sync();
//  })(); //pour generer auto DB
(async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');

        await db.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' 
}));
app.use(express.json());
app.use(UserRoute);

app.use(AuthRoute);
app.use('/api', productRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//store.sync();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));


app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});
