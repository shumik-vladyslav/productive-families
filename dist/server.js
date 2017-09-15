"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const mysql = require("mysql");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const index_1 = require("./routes/index");
const chef_1 = require("./routes/chef");
const dish_1 = require("./routes/dish");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    api() {
    }
    config() {
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "DELETE,PATCH");
            next();
        });
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "aywcz1q8",
            database: "PRODUCTIVEFAMILIES"
        });
        this.connection.connect((err) => {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
    }
    routes() {
        let router;
        router = express.Router();
        index_1.IndexRoute.create(router);
        this.app.use(router);
        let chefRouter = express.Router();
        chef_1.ChefRoute.initialize(chefRouter, this.connection);
        this.app.use('/chef', chefRouter);
        let dishRouter = express.Router();
        dish_1.DishRoute.initialize(dishRouter, this.connection);
        this.app.use('/chef/:chefId/dish', dishRouter);
    }
}
exports.Server = Server;
