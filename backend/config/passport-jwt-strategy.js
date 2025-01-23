import UserModel from '../models/User.js';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import passport from 'passport';

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY
}

passport.use(new JWTStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await UserModel.findOne({_id:jwt_payload._id}).select('-password');
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    } catch(err) {
        return done(err, false);
    }
}));
