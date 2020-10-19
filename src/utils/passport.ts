import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import * as PassportJwt from 'passport-jwt';
import { User } from '../models/User';
import {
  getGoogleEnviromentVariables,
  getJwtEnviromentVariables
} from './enviroment';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';

const googleKeys = getGoogleEnviromentVariables();
const jwtOpts = {
  secretOrKey: getJwtEnviromentVariables().jwtSecret,
  jwtFromRequest: (req: Request) => {
    // tell passport to read JWT from cookies
    console.log(req.cookies);
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
        User.findOne({ where: { providerId: profile.id } })
          .then((currentUser) => {
            if (currentUser) {
              //if we already have a record with the given profile ID
              done(undefined, currentUser.toJSON());
            } else {
              //if not, create a new user
              User.create({
                providerId: profile.id,
                email: profile.emails ? profile.emails[0].value || '' : '',
                name: profile.displayName,
                provider: 'google'
              }).then((newUser) => {
                done(undefined, newUser.toJSON());
              });
            }
          })
          .catch((err) => {
            done(err);
          });
      }
    )
  );
  passport.use(new AnonymousStrategy());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: User, done) => {
    // TODO: TypeCheck of id
    // @ts-ignore
    User.findByPk(user.id).then((u) => {
      u ? done(null, u.toJSON()) : done(new Error('User doesnt exist'));
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
