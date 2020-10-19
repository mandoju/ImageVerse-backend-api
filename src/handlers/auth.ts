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
    const { jwtSecret } = getJwtEnviromentVariables();

    let acessToken = sign(
      {
        data: req.user
      },
      jwtSecret,
      { expiresIn: 60 }
    ); // expiry in seconds
    const refreshToken = await Token.create({
      tokenId: uid(256),
      userId
    });
    const { webRedirect, webDomain } = getGoogleEnviromentVariables();
    console.log(webDomain);
    res.cookie('jwt', acessToken, { domain: webDomain });
    res.cookie('refreshToken', refreshToken.tokenId, { domain: webDomain });
    res.redirect(webRedirect);
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
    const { webDomain } = getGoogleEnviromentVariables();
    res.cookie('jwt', acessToken, { domain: webDomain });
    return res.json({ message: 'success', jwt: acessToken });
  } else {
    return res.status(401).send('No user');
  }
});

routes.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  const { webDomain } = getGoogleEnviromentVariables();
  res.clearCookie('jwt', { domain: webDomain });
  res.clearCookie('refreshToken', { domain: webDomain });
  res.clearCookie('G_AUTHUSE_H', { domain: webDomain });
  res.redirect(getGoogleEnviromentVariables().webRedirect);
});

export const AuthRoutes = routes;
