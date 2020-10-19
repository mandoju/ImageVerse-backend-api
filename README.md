# ImageVerse backend api

This is a rest api to serve Imageverse application.

## Quick Overview
there are two aways to run this project, one using docker and another for development. To see about Routes, look at Wiki.

### Running with Docker
 To run this project using docker, you need to adjust the enviroment variables inside docker-compose.yml. With enviroment variables configured you only need to execute the commands bellow to run the project:
 ```
 yarn
 yarn build
 docker-compose up
 ```
 if everything ok , the project should be running ``http://localhost:8000` or another port that was configured.

### Running without docker
 To run the project, first you need a ``postgresql`` database server. After that without docker you should configure ``.env`` file according ``.env.example``. After that you only need to execute the bellow commands:
 ```
 yarn
 yarn start
 ```
 and backend api should be running on ``localhost:8000``

## Enviroment Variables

 this project has a some enviroment variables that needs to be configured to run.
 Postgresql enviroment variables:
  - DATABASE_HOST : Postgresql Hostname
  - DATABASE_NAME : Postgresql Databasename
  - DATABASE_USERNAME: Postgresql Username
  - DATABASE_PASSWORD: Postgresql Password
  - DATABASE_PORT: Postgresql Port
 
 AWS enviroment variables:
  - AWS_REGION: Aws region to run aws sdk functions
  - AWS_IMAGES_BUCKET: Aws bucket endpoint

 API enviroment variables 
  - PORT: port which api will listen
  - COOKIE_KEY: Cookie secret of api
  - JWT_SECRET: Json Web Token (JWT) Secret for auth

  Google Api Enviroment Variables
  - GOOGLE_CLIENT_ID: Oauth2 Google cliend id
  - GOOGLE_CLIENT_SECRET: Oauth2 Google client secret
  - AUTH_WEB_REDIRECT: frontend address (used to redirect after auth)

## Dependencies
 this project has some depencies: 
  - aws-sdk: used to comunicate with aws functions
  - "body-parser": Body parser middleware for Express
  - "cookie-parser": Cookie parser middleware for Express
  - "cors": Cors middleware for Express
  - "dotenv": Used for .env files
  - "express": Framework used to create the rest api
  - "express-session": Used to manipulate sessions
  - "jsonwebtoken":  Used to manipulate JWT
  - "multer": Used to manipulate upload files
  - "multer-s3": Used to upload files to AWS s3,
  - "passport": Used for authentication
  - "passport-anonymous": Used to separate logged users from non logged.
  - "passport-google-oauth20": Used for Google Oauth2 login
  - "passport-jwt": Used for JWT authentication
  - "pg": Used to connect with postgres
  - "pg-hstore": Used to connect with postgres
  - "rand-token": Used to generate random characters for tokens
  -  "sequelize": Database ORM
  -  "uuid": Used to create UUid