import express from 'express';
import passport from 'passport';
import setTokensCookies from '../utils/setTokensCookies.js';

const router = express.Router();

router.get('/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login` }),
    (req, res) => {
        console.log('Google Auth Callback triggered');
        const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = req.user;
        console.log('user: ', user);
        setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);
        res.redirect(`${process.env.FRONTEND_HOST}/user/profile`);
    }
);

export default router;
