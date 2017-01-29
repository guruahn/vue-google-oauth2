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

## Usage
Handling Google sign-in, this is added within the login page
```
import Vue from 'vue'

Vue.googleAuth().signIn(function (googleUser) { 
  // things to do when sign-in succeeds
  // To get the access token: googleUser.access_token
}, function () {
  // things to do when sign-in fails
))
```

Handling Google sign-out
```
import Vue from 'vue'

Vue.googleAuth().signOut(function () { 
  // things to do when sign-out succeeds
}, function () {
  // things to do when sign-out fails
))
```
