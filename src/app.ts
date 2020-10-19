require('dotenv').config();
import express from 'express';
import { ImageRoutes } from './handlers/image';
import { configurePassport } from './utils/passport';
import { AuthRoutes } from './handlers/auth';
import passport from 'passport';
import { UserRoutes } from './handlers/user';
import { LikeRoutes } from './handlers/like';
import cookieParser from 'cookie-parser';
import { sequelize } from './services/database';
import cors from 'cors';
import {
  getAwsEnviromentVariables,
  getGoogleEnviromentVariables
} from './utils/enviroment';
import AWS from 'aws-sdk';

export const AppCreator = () => {
  try {
    sequelize
      .authenticate()
      .then(() => console.log('Connection has been established successfully.'));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw new Error(error);
  }
  sequelize.sync({ alter: true });

  const { awsAccessKey, awsSecretKey } = getAwsEnviromentVariables();
  if (awsAccessKey && awsSecretKey) {
    AWS.config.update({
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey
    });
  }

  configurePassport();

  const app = express();
  var corsOption = {
    origin: `${getGoogleEnviromentVariables().webRedirect}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };

  app.use(cors(corsOption));
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use('/images', ImageRoutes);
  app.use('/auth', AuthRoutes);
  app.use('/profile', UserRoutes);
  app.use('/like', LikeRoutes);
  return app;
};
