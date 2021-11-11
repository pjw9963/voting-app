import express from 'express';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './executableSchema.js';
import passport from 'passport';
import userRepo from './repos/userRepo.js';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors())

app.use(session({
  genid: (req) => uuid(),
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }  set this to only send with https
}));

const githubOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback"
};

const githubCallback = (accessToken, refreshToken, profile, done) => {
  const users = userRepo.getUsers();
  const matchingUser = users.find(user => user.githubId === profile.id);
  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const newUser = {
    id: uuid(),
    githubId: profile.id,
    firstName: profile.displayName.split(' ')[0],
    lastName: profile.displayName.split(' ')[1],
  };
  users.push(newUser);
  done(null, newUser);
};

passport.use(new GitHubStrategy(
  githubOptions,
  githubCallback
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const matchingUser = userRepo.getUserById(id);
  done(null, matchingUser);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/graphql',
  graphqlHTTP((req, res, graphQLParams) => {
    return {
      schema: schema,
      graphiql: true,
      context: {
        getUser: () => req.user,
        logout: () => req.logout(),
      },
    }
  }),
);

app.get('/auth/github', passport.authenticate('github', { scope: ['email'] }));
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: 'http://localhost:4000/graphql',
  failureRedirect: 'http://localhost:4000/graphql',
}));

app.listen(4000);
console.log('we are running baby ;)')