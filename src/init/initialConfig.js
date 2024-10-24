import express from 'express';
import handlebars from "express-handlebars";
import { __dirname } from '../utils.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import initPassport from "../passport/jwt.passport.js"
import MongoSingleton from '../mongo/connection.js';
import cors from 'cors';

export const AppInit = (app) => {
    dotenv.config()
    MongoSingleton.getInstance()
    const hbs = handlebars.create({
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    });
    app.use(cors())
    app.use(cookieParser(process.env.PRIVATE_KEY))
    initPassport()
    app.engine('handlebars', hbs.engine);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}