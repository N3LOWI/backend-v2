const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const User = require("../model/model-user");

module.exports = (passport) => {
  // Local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email', // El campo utilizado para el nombre de usuario en la solicitud
      passwordField: 'password' // El campo utilizado para la contraseña en la solicitud
    },
    async (email, password, done) => {
      console.log(password)
      try {
        // Lógica para buscar y verificar al usuario en la base de datos
        const user = await User.findOne({ email });
        
        console.log(user)
        
        if (!user) {
          return done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));


  // JWT strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};