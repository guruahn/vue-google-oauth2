# vue-google-oauth2
Handling Google sign-in and sign-out for Vue.js applications

Forked from https://github.com/TinyNova/vue-google-oauth

Same as fork but allows you to override options and a few other bug fixes.

## Installation
```
npm install vue-google-oauth2
```

## Initialization
```
import GAuth from 'vue-google-oauth2'

Vue.use(GAuth, {clientId: '458494958493-2gqknkvdjfkdfkvb8uja2k65sldsms7qo9.apps.googleusercontent.com'})
```
Ideally you shall place this in your app entry file, e.g. src/main.js

## Usage - Sign-in
### (a) Handling Google sign-in, getting the one-time authorization code from Google
```
this.$gAuth.getAuthCode(function (authCode) {
	//on success
	console.log('authCode', authCode)
	this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' }).then(function (response) {

	})
}, function (error) {
	//on fail do something
})
```

The `authorizationCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access token and refresh token.


### (b) Alternatively, if you would like to directly get back the access_token and id_token
```
this.$gAuth.signIn(function (user) {
	//on success do something
	console.log('user', user)
}, function (error) {
	//on fail do something
})
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
this.$gAuth.signOut(function () {
  // things to do when sign-out succeeds
}, function (error) {
  // things to do when sign-out fails
})
```

## Additional Help
Do refer to this [sample login page HTML file](https://github.com/guruahn/vue-google-oauth2/blob/master/sample.html).

If you are curious of how the entire Google sign-in flow works, please refer to the diagram below
![Google Sign-in Flow](http://i.imgur.com/BQPXKyT.png)
