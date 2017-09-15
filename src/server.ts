import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as mysql from "mysql";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { IndexRoute } from "./routes/index";
import { ChefRoute } from "./routes/chef";
import {DishRoute} from "./routes/dish";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  public connection : mysql.IConnection;
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    //empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    //mount override?
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());

    this.app.use((req,res,next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "DELETE,PATCH");
        // res.header("Access-Control-Allow-Methods", "PATCH");
        // res.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        next();
    });

    // configure db connection
    this.connection = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "aywcz1q8",
          database: "PRODUCTIVEFAMILIES"
      });

      // // configure db connection
      // this.connection = mysql.createConnection({
      //     host: "us-cdbr-iron-east-05.cleardb.net",
      //     user: "b2bc51e289606e",
      //     password: "be20cc51",
      //     database: "heroku_3422c4713e5dc25"
      // });

    // establish db connection
    this.connection.connect((err) =>{
        if(err){
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
    });
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    //IndexRoute
    IndexRoute.create(router);
    this.app.use(router);

      // ChefRoute
      let chefRouter = express.Router();
      ChefRoute.initialize(chefRouter,this.connection);
      this.app.use('/chef',chefRouter);

    let dishRouter = express.Router();
    DishRoute.initialize(dishRouter,this.connection);
    this.app.use('/chef/:chefId/dish',dishRouter);

  }
}
