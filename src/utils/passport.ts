import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import * as PassportJwt from 'passport-jwt';
import { User } from '../models/User';
import {
  getGoogleEnviromentVariables,
  getJwtEnviromentVariables
} from './enviroment';

const googleKeys = getGoogleEnviromentVariables();
const jwtOpts = {
  secretOrKey: getJwtEnviromentVariables().jwtSecret,
  jwtFromRequest: (req: Request) => {
    // tell passport to read JWT from cookies
    var token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  }
};

export const configurePassport = () => {
  passport.use(
    new PassportJwt.Strategy(jwtOpts, (jwt_payload, done) => {
      if (CheckUser(jwt_payload.data)) {
        return done(null, jwt_payload.data);
      } else {
        return done(null, false);
      }
    })
  );
  passport.use(
    new Strategy(
      {
        clientID: googleKeys.clientId,
        clientSecret: googleKeys.clientSecret,
        callbackURL: '/auth/google/redirect'
      },
      (accessToken, refreshToken, profile, done) => {
        //check if user already exists in our db with the given profile ID
        User.get({ id: profile.id })
          .then((currentUser) => {
            if (currentUser) {
              //if we already have a record with the given profile ID
              done(undefined, currentUser);
            } else {
              //if not, create a new user
              new User({
                id: profile.id,
                email: profile.emails ? profile.emails[0].value || '' : '',
                name: profile.displayName,
                provider: 'google'
              })
                .save()
                .then((newUser) => {
                  done(undefined, { ...newUser });
                });
            }
          })
          .catch((err) => {
            done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    // TODO: TypeCheck of id
    // @ts-ignore
    User.get(id).then((user) => {
      done(null, { ...user });
    });
  });
};

export const isAuthenticated = passport.authenticate('jwt', { session: false });
// export function isAuthenticated(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.user) {
//     return next();
//   }
//   res.status(401).json({ message: 'not authenticated!' });
// }

function CheckUser(input: { id: string; provider: string }) {
  if (input.id && input.provider) return true; // found
  return false;
}
