import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback"
      },
      async (_, __, profile, done) => {
        console.log("🔵 Google Profile:", profile.displayName, profile.emails[0].value);
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (user && user.provider !== "google") {
          return done(null, false);
        }

        if (!user) {
          user = await User.create({
            email,
            provider: "google"
          });
        }

        done(null, user);
      }
    )
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ["id", "emails", "name"]
      },
      async (_, __, profile, done) => {
        console.log("🔵 Facebook Profile:", profile.name, profile.emails ? profile.emails[0].value : "No Email");

        const email = profile.emails ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("Facebook account has no email"), false);
        }

        let user = await User.findOne({ email });

        if (user && user.provider !== "facebook") {
          return done(null, false);
        }

        if (!user) {
          user = await User.create({
            email,
            provider: "facebook"
          });
        }

        done(null, user);
      }
    )
  );
}
