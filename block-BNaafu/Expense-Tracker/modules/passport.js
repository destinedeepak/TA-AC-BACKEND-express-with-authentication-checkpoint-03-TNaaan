var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/User');

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        var profileData = {
          name: profile.displayName,
          username: profile.displayName,
          email: profile._json.email,
        };
      //   console.log(profile);
        User.findOne({ email: profile._json.email }, (error, user) => {
          if (error) return done(error);
          // console.log(user, "uuuuuusssseeeerrr");
          if (!user) {
            User.create(profileData, (err, addedUSer) => {
              if (error) return done(error);
              // console.log(addedUser, "addddd");
              return done(null, addedUser);
            });
          }
          else{
              // console.log(user, "Ussserr")
              done(null, user);
          }
        });
      }
    )
  );

passport.use(
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        callbackURL: '/auth/github/callback'
    },(accessToken, refreshToken, profile, done) => {
        const userProfile = {
            name: profile.displayName,
            email: profile._json.email,
            username: profile.username
        }
        User.findOne({email: userProfile.email}, (error, user) => {
            if(error) return done(error);
            if(!user){
                User.create(userProfile, (error, addedUser) => {
                    return done(null, addedUser);
                })
            }else{
                return done(null,user);
            }
        })
    }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    User.findById(userId, (error, user) => {
        done(error, user)
    })
})