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
Handling general Google sign-in, this is added within the login page
```
import Vue from 'vue'

Vue.googleAuth().signIn(function (googleUser) { 
  // things to do when sign-in succeeds
}, function () {
  // things to do when sign-in fails
))
```

Alternatively, if you would like to access to user's information offline
```
import Vue from 'vue'

// Just add this line to turn on the offline access mode
Vue.googleAuth().hasOfflineAccess()

Vue.googleAuth().signIn(function (googleUser) { 
  // things to do when sign-in succeeds
}, function () {
  // things to do when sign-in fails
))
```

## Usage - Sign-out
Handling Google sign-out
```
import Vue from 'vue'

Vue.googleAuth().signOut(function () { 
  // things to do when sign-out succeeds
}, function () {
  // things to do when sign-out fails
))
```
