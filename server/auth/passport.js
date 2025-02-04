const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userDAO = require("../dao/UserDAO.js");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const configUtil = require("../config/configUtil.js")

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, done) {
      userDAO
        .getByUsername(username)
        .then(userModel => {
          if (userModel) {
            if (userModel.password === password) {
              return done(null, userModel, {
                message: "Logged in successfully"
              });
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          } else {
            return done(null, false, {
              message: "User not found with that username."
            });
          }
        })
        .catch(err => {
          return done(null, false, {
            message: "User not found with that username"
          });
        });
    }
  )
);

passport.use(
  "loggedIn",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: configUtil.getDatabaseUri(),
      passReqToCallback: true
    },
    async (req, jwtPayload, done) => {
      req.userId = jwtPayload.id;
      if (userDAO.get(jwtPayload.id)) {
        return done(null, true);
      } else {
        return done("Invalid token?");
      }
    }
  )
);
