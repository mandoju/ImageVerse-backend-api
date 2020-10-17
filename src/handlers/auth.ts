import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { uid } from 'rand-token';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { getJwtEnviromentVariables } from '../utils/enviroment';
import { isAuthenticated } from '../utils/passport';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';

const routes = Router();

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

routes.get(
  '/google/redirect',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Missing user');
    }
    //@ts-ignore
    const userId = req.user.id;
    const { jwtSecret } = getJwtEnviromentVariables();

    let acessToken = sign(
      {
        data: req.user
      },
      jwtSecret,
      { expiresIn: 60 }
    ); // expiry in seconds

    const refreshToken = await Token.create({ tokenId: uid(256), userId });
    refreshToken.save();
    console.log(refreshToken);
    res.cookie('jwt', acessToken);
    res.cookie('refreshToken', refreshToken.toJSON().tokenId);
    res.redirect('/');
  }
);

routes.post('/token', bodyParserBodyMiddleware, async (req, res) => {
  const tokenId = req.cookies['refreshToken'];
  // @ts-ignore
  const userId = req.body.userId;
  if (!tokenId || !userId) {
    return res.status(400).send('missing refresh token or userId');
  }
  const token = await Token.query({ tokenId, userId }).exec();
  if (token) {
    const user = await User.get({ id: userId });
    const { jwtSecret } = getJwtEnviromentVariables();
    let acessToken = sign(
      {
        data: user
      },
      jwtSecret,
      { expiresIn: 60 }
    );
    res.cookie('jwt', acessToken);
    return res.json({ message: 'sucess' });
  } else {
    return res.status(401).send('No user');
  }
});

routes.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.send({ message: 'ok' });
});

export const AuthRoutes = routes;
