# vue-google-oauth2
Handling Google sign-in and sign-out for Vue.js applications.

![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-google-oauth2.svg)
![GitHub](https://img.shields.io/github/license/guruahn/vue-google-oauth2.svg)
![vue-google-oauth2](https://img.shields.io/npm/dt/vue-google-oauth2.svg)

[Version 1.x.x Documentation here!](https://github.com/guruahn/vue-google-oauth2/blob/master/README_V1.md)

[Front-end Demo](https://stupefied-darwin-da9533.netlify.com/)

## Installation
### Installation with npm
```
npm install vue-google-oauth2
```

### Installation with yarn
```
yarn add vue-google-oauth2
```

## Initialization

### Vue.js 2.x
```javascript
//src/main.js
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: 'YOUR_CLIENT_ID',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

```

### Vue.js 3.x
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import GAuth from 'vue-google-oauth2'
const app = createApp(App)
app.use(GAuth, { clientId: 'YOUR_CLIENT_ID', scope: 'email', prompt: 'consent', fetch_basic_profile: false })
```


## Options
| Property     | Type     | Required        | Description     |
|--------------|----------|-----------------|-----------------|
| clientId     | String   | Required.       | The app's client ID, found and created in the Google Developers Console. |
| scope        | String   | Optional.       | Default value is `profile email`. [Full list of scopes](https://developers.google.com/identity/protocols/googlescopes). |
| prompt       | String   | Optional.       | This value using for [authCode.](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2offlineaccessoptions) The possible values are `select_account` or `consent`. Default value is `select_account`. To get refresh token from auth code, use `consent`.|
| fetch_basic_profile       | Boolean   | Optional.       | If set to true, `email profile openid` will [be automatically added as scope](https://developers.google.com/identity/sign-in/web/sign-in). Default value is `true`. |

## Methods
| Property     | Description        | Type     |
|--------------|--------------------|----------|
| GoogleAuth   | return of [gapi.auth2.getAuthInstance()](https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse)   | Object |
| signIn       | function for sign-in | Function  |
| getAuthCode  | function for getting authCode | Function  |
| signOut      | function for sign-out | Function  |


## Usages
### Getting authorization code
The `authCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access_token and refresh_token.

The `access_token` and `refresh_token` can be saved in backend storage for reuse and refresh. In this way, you can avoid exposing your api key or secret key whenever you need to use various google APIs.

```javascript
const authCode = await this.$gAuth.getAuthCode()
const response = await this.$http.post('http://your-backend-server-api-to-use-authcode', { code: authCode, redirect_uri: 'postmessage' })
```

### Sign-in: Directly get back the `access_token` and `id_token`

```javascript
const googleUser = await this.$gAuth.signIn()
// googleUser.getId() : Get the user's unique ID string.
// googleUser.getBasicProfile() : Get the user's basic profile information.
// googleUser.getAuthResponse() : Get the response object from the user's auth session. access_token and so on
this.isSignIn = this.$gAuth.isAuthorized
// TODO: injection 코드로 대체.  

```

refer to [google signIn reference : GoogleUser](https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid)


### Sign-out
Handling Google sign-out
```javascript
const response = await sthis.$gAuth.signOut()
```

## Extra - Directly get `access_token` and `refresh_token` on Server-side
To get `access_token` and `refresh_token` in server side, the data for `redirect_uri` should be `postmessage`. `postmessage` is magic value for `redirect_uri` to get credentials without actual redirect uri.

### Curl
```
curl -d "client_id=YOUR_CLIENT_ID&\
  client_secret=YOUR_CLIENT_SECRET&\
  redirect_uri=postmessage&\
  grant_type=authorization_code&\
  code=YOUR_AUTH_CODE" https://accounts.google.com/o/oauth2/token
```

### Sample Code
- [Golang Sample Code](https://github.com/guruahn/vue-google-oauth2/blob/master/backend-samples/golang/main.go)
- [Python Sample Code](https://github.com/guruahn/vue-google-oauth2/blob/master/backend-samples/python/main.py)
- [Front Sample Code](https://github.com/guruahn/vue-google-oauth2-front-sample)

## Additional Help
- [sample login page HTML file](https://github.com/guruahn/vue-google-oauth2/blob/master/sample.html).
- [Google API Client Libraries : Methods and Classes](https://developers.google.com/api-client-library/javascript/reference/referencedocs)
- If you are curious of how the entire Google sign-in flow works, please refer to the diagram below
![Google Sign-in Flow](http://i.imgur.com/BQPXKyT.png)


## FAQ
### The failure of initialization happens
You can check the brower console to check errors which occur during initialization.
The most of errors are from inproper setting of google oauth2 credentials setting in Google Developer Console.
After changing the settings, you have to do hard refresh to clear your caches.

