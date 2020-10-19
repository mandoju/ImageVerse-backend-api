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

  configurePassport();

  const app = express();
  var corsOption = {
    origin: true,
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
