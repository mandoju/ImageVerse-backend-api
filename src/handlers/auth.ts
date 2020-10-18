import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { uid } from 'rand-token';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { isAuthenticated } from '../utils/passport';
import { bodyParserBodyMiddleware } from '../middlewares/bodyParser';
import {
  getGoogleEnviromentVariables,
  getJwtEnviromentVariables
} from '../utils/enviroment';

const routes = Router();

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

routes.post(
  '/google',
  passport.authenticate(
    'google',
    {
      session: false,
      scope: ['profile', 'email']
    },
    function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      req.auth = {
        id: req.user.id
      };

      next();
    }
  ),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Missing user');
    }
    //@ts-ignore
    const userId = req.user.id;
    console.log(req.user);
    const { jwtSecret } = getJwtEnviromentVariables();

    let acessToken = sign(
      {
        data: req.user
      },
      jwtSecret,
      { expiresIn: 60 }
    ); // expiry in seconds
    console.log(userId);
    const refreshToken = await Token.create({
      tokenId: uid(256),
      userId
    });
    res.cookie('jwt', acessToken);
    res.cookie('refreshToken', refreshToken.tokenId);
    res.send({ message: 'success' });
  }
);

routes.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Missing user');
    }
    //@ts-ignore
    const userId = req.user.id;
    console.log(req.user);
    const { jwtSecret } = getJwtEnviromentVariables();

    let acessToken = sign(
      {
        data: req.user
      },
      jwtSecret,
      { expiresIn: 60 }
    ); // expiry in seconds
    console.log(userId);
    const refreshToken = await Token.create({
      tokenId: uid(256),
      userId
    });
    res.cookie('jwt', acessToken);
    res.cookie('refreshToken', refreshToken.tokenId);
    //res.send({ message: 'success' });
    res.redirect(getGoogleEnviromentVariables().webRedirect);
  }
);

routes.post('/token', bodyParserBodyMiddleware, async (req, res) => {
  const tokenId: string = req.cookies['refreshToken'];
  // @ts-ignore
  const userId: string = req.body.userId;
  if (!tokenId || !userId) {
    return res.status(400).json({ message: 'missing refresh token or userId' });
  }
  const token = await Token.findOne({ where: { tokenId, userId } });
  if (token) {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(500).json({ message: 'user does not exist' });
    }
    const { jwtSecret } = getJwtEnviromentVariables();
    let acessToken = sign(
      {
        data: user?.toJSON()
      },
      jwtSecret,
      { expiresIn: 60 }
    );
    res.cookie('jwt', acessToken);
    return res.json({ message: 'success' });
  } else {
    return res.status(401).send('No user');
  }
});

routes.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.send({ message: 'ok' });
});

export const AuthRoutes = routes;
