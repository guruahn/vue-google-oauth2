# vue-google-auth
Handling Google sign-in and sign-out for Vue.js applications

## Installation
```
npm install vue-google-auth
```

## Initialization
```
import GoogleAuth from 'vue-google-auth'

Vue.use(GoogleAuth, { clientID: 'xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com' })
Vue.googleAuth().load()
```
Ideally you shall place this in your app entry file, e.g. src/main.js

## Usage - Sign-in
###(a) Handling Google sign-in, getting the one-time authorization code from Google
```
import Vue from 'vue'

Vue.googleAuth().signIn(function (authorizationCode) { 

  // things to do when sign-in succeeds
  
  // You can send the authorizationCode to your backend server for further processing, for example
  this.$http.post('http://your/backend/server', { code: authorizationCode, redirect_uri: 'postmessage' }).then(function (response) {
    if (response.body) {
      // ...
    }
  }, function (error) {
    console.log(error)
  })
  
}, function (error) {
  // things to do when sign-in fails
))
```

The `authorizationCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access token and refresh token.


###(b) Alternatively, if you would like to directly get back the access_token and id_token
```
import Vue from 'vue'

// Just add in this line
Vue.googleAuth().directAccess()

Vue.googleAuth().signIn(function (googleUser) { 
  // things to do when sign-in succeeds
}, function (error) {
  // things to do when sign-in fails
))
```

The `googleUser` object that is being returned will be:
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

## Additional Help
Do refer to this [sample login page HTML file](https://github.com/simmatrix/vue-google-auth/blob/master/sample.html).

If you are curious of how the entire Google sign-in flow works, please refer to the diagram below
![Google Sign-in Flow](http://i.imgur.com/BQPXKyT.png)