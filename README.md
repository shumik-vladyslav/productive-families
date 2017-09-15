# TypeScript 2 + Express + Node.js

This is a repository to go with my article on creating an Express web application using TypeScript 2.


change db connection config in server.ts file
// configure db connection
this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "aywcz1q8",
      database: "PRODUCTIVEFAMILIES"
  });

## Install

Install the node packages via:

`$ npm install`

And then run the grunt task to compile the TypeScript:

`$ npm run grunt`

## Starting

To start the server run:

`$ npm start`
