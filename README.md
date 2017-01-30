# vue-google-auth
Handling Google sign-in and sign-out for Vue.js applications

## Installation
`npm install simmatrix/vue-google-auth`

## Initialization
```
import GoogleAuth from 'vue-google-auth'

Vue.use(GoogleAuth, { clientID: 'xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com' })
Vue.googleAuth().load()
```
Ideally you shall put in this in your main file, e.g. main.js

## Usage - Sign-in
(a) Handling general Google sign-in, this is added within the login page
```
import Vue from 'vue'

Vue.googleAuth().signIn(function (googleUser) { 
  // things to do when sign-in succeeds
}, function (error) {
  // things to do when sign-in fails
))
```

The `googleUser` that is being returned will be:
```
{
  "token_type": "Bearer",
  "access_token": "xxx",
  "scope": "xxx",
  "login_hint": "xxx",
  "expires_in": 3600,
  "id_token": "xxx",
  "session_state": {
    "extraQueryParams": {
      "authuser": "0"
    }
  },
  "first_issued_at": 1234567891011,
  "expires_at": 1234567891011,
  "idpId": "google"
}
```

(b) Alternatively, if you would like to access to user's information offline
```
import Vue from 'vue'

// Just add this line to turn on the offline access mode
Vue.googleAuth().hasOfflineAccess()

Vue.googleAuth().signIn(function (authorization_code) { 
  // things to do when sign-in succeeds
}, function (error) {
  // things to do when sign-in fails
))
```

The `authorization_code` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access token and refresh token.

## Usage - Sign-out
Handling Google sign-out
```
import Vue from 'vue'

Vue.googleAuth().signOut(function () { 
  // things to do when sign-out succeeds
}, function (error) {
  // things to do when sign-out fails
))
```
