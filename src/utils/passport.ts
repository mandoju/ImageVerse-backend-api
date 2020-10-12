import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { getGoogleEnviromentVariables } from './enviroment';

const googleKeys = getGoogleEnviromentVariables();

export const configurePassport = () => {
  passport.use(
    new Strategy(
      {
        clientID: googleKeys.clientId,
        clientSecret: googleKeys.clientSecret,
        callbackURL: '/auth/google/redirect'
      },
      (accessToken, refreshToken, profile, done) => {
        //check if user already exists in our db with the given profile ID
        User.get(profile.id).then((currentUser) => {
          if (currentUser) {
            //if we already have a record with the given profile ID
            done(undefined, currentUser);
          } else {
            //if not, create a new user
            new User({
              id: profile.id,
              email: profile.emails ? profile.emails[0] || '' : '',
              name: profile.displayName,
              provider: 'google'
            })
              .save()
              .then((newUser) => {
                done(undefined, newUser);
              });
          }
        });
      }
    )
  );

  passport.deserializeUser((id, done) => {
    // TODO: TypeCheck of id
    // @ts-ignore
    User.get(id).then((user) => {
      done(null, user);
    });
  });
};
