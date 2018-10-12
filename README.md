# vue-google-oauth2
Handling Google sign-in and sign-out for Vue.js applications

Forked from https://github.com/TinyNova/vue-google-oauth

Same as fork but allows you to override options and a few other bug fixes.

## Installation
```
npm install vue-google-oauth2
```

## Initialization
```javascript
import GAuth from 'vue-google-oauth2'

Vue.use(GAuth, {clientId: '4XXXXXXXX93-2gqknkvdjfkdfkvb8uja2k65sldsms7qo9.apps.googleusercontent.com', scope: 'profile email https://www.googleapis.com/auth/plus.login'})

```
Ideally you shall place this in your app entry file, e.g. src/main.js

## Usage - Sign-in
### (a) Handling Google sign-in, getting the one-time authorization code from Google

#### Frontend-side(Vue.js)
```javascript
this.$gAuth.getAuthCode(function (authorizationCode) {
	//on success
	this.$http.post('http://your-backend-server.com/auth/google', { code: authorizationCode, redirect_uri: 'postmessage' }).then(function (response) {

	})
}, function (error) {
	//on fail do something
})
```
The `authorizationCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access token and refresh token.

#### Backend-side(Golang)
```go
auth_code := ac.Code //from front-end side
// generate a config of oauth
conf := &oauth2.Config{
	ClientID:     "XXXXXXXX",
	ClientSecret: "XXXXXXXX",
	RedirectURL:  "postmessage",
	Scopes: []string{
		"profile",
		"email",
		"https://www.googleapis.com/auth/plus.login",
	},
	Endpoint: "XXXXXX",
}
// exchange to token inclued refresh_token from code
token, err = conf.Exchange(oauth2.NoContext, auth_code)
if err != nil {
		sErr := NewStatusErr(401, err.Error(), "Unauthorized")
		return nil, &sErr
}
```
Note, ```RedirectURL``` must be ```postmessage```!!



### (b) Alternatively, if you would like to directly get back the access_token and id_token
```javascript
this.$gAuth.signIn(function (user) {
	//on success do something
	console.log('user', user)
}, function (error) {
	//on fail do something
})
```

The `googleUser` object that is being returned will be:
```javascript
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
```javascript
this.$gAuth.signOut(function () {
  // things to do when sign-out succeeds
}, function (error) {
  // things to do when sign-out fails
})
```

## Usage - Check api loaded
Handling Check Google api loaded
```html
<template>
  <div>
    <h1>Test</h1>
    <button @click="handleClickGetAuth" :disabled="!isLoaded">get auth code</button>
  </div>
</template>
<script>
  data () {
    return {
      isLoaded: false
    }
  },
  methods: {
    handleClickGetAuth(){
      this.$gAuth.getAuthCode(function (authCode) {
        //on success
        this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' }).then(function (response) {

        })
      }, function (error) {
        //on fail do something
      })
    },
  },
  mounted(){
    let that = this
    let checkGauthLoad = setInterval(function(){
      that.isLoaded = that.$gAuth.isLoaded()
      if(that.isLoaded) clearInterval(checkGauthLoad)
    }, 1000);
  }
</script>
```

## Additional Help
Do refer to this [sample login page HTML file](https://github.com/guruahn/vue-google-oauth2/blob/master/sample.html).

If you are curious of how the entire Google sign-in flow works, please refer to the diagram below
![Google Sign-in Flow](http://i.imgur.com/BQPXKyT.png)
