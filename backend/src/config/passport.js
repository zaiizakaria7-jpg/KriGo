const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("🔵 Google Profile:", profile.displayName);

          const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.id}@google.com`;

          const nom = profile.name?.familyName || "Unknown";
          const prenom = profile.name?.givenName || "User";

          let user = await User.findOne({ email });

          if (user) {
            // If user exists but no provider set (legacy), update it
            if (!user.provider) {
              user.provider = "google";
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            email,
            nom,
            prenom,
            role: "user", // Default role
            provider: "google"
          });

          done(null, user);
        } catch (error) {
          console.error("Error in Google Strategy:", error);
          done(error, null);
        }
      }
    )
  );
  console.log("✅ Google Strategy initialized");
} else {
  console.warn("⚠️ Google Strategy NOT initialized: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "emails", "name"]
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("🔵 Facebook Profile:", profile.displayName);

          const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.id}@facebook.com`;

          const nom = profile.name?.familyName || "Unknown";
          const prenom = profile.name?.givenName || "User";

          let user = await User.findOne({ email });

          if (user) {
            if (!user.provider) {
              user.provider = "facebook";
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            email,
            nom,
            prenom,
            role: "user",
            provider: "facebook"
          });

          done(null, user);
        } catch (error) {
          console.error("Error in Facebook Strategy:", error);
          done(error, null);
        }
      }
    )
  );
  console.log("✅ Facebook Strategy initialized");
} else {
  console.warn("⚠️ Facebook Strategy NOT initialized: Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET");
}
