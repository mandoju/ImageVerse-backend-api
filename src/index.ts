require('dotenv').config();
import express from 'express';
import * as dynamoose from 'dynamoose';
import { ImageRoutes } from './handlers/image';
import { configurePassport } from './utils/passport';
import { AuthRoutes } from './handlers/auth';
import session from 'express-session';
import passport from 'passport';
import {
  getApiEnviromentVariables,
  getAwsEnviromentVariables
} from './utils/enviroment';
import { UserRoutes } from './handlers/user';

const sdk = dynamoose.aws.sdk;
sdk.config.update({
  region: getAwsEnviromentVariables().awsRegion
});
if (process.env.NODE_ENV === 'development') {
  dynamoose.aws.ddb.local('http://localhost:8001');
}
configurePassport();

const app = express();
const port = getApiEnviromentVariables().port;

app.use(
  session({
    // milliseconds of a day
    secret: getApiEnviromentVariables().cookieKey,
    resave: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000 * 24 * 365
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/images', ImageRoutes);
app.use('/auth', AuthRoutes);
app.use('/profile', UserRoutes);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
