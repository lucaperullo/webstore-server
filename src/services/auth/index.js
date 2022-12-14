import passport from "passport";
import FacebookStrategy from "passport-facebook";
import UserModel from "../users/schema.js";
import { authenticate } from "../auth/tools.js";

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.CLI_URL + "/users/facebookRedirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (profile, next) {
   
      try {
        const user = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (!user) {
          const [name, surname] = profile.displayName.split(" ");
          const newUser = {
            name,
            surname,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            refreshTokens: [],
          };
          console.log(newUser);
          let createdUser = new UserModel(newUser);
          console.log(createdUser);
          createdUser = await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        } else {
          const tokens = await authenticate(user);
          next(null, { user, tokens });
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
);
passport.serializeUser(function (user, next) {
  next(null, user);
});
