# vue-google-oauth2
Handling Google sign-in and sign-out for Vue.js applications.
Forked from https://github.com/TinyNova/vue-google-oauth


## Installation
```
npm install vue-google-oauth2
yarn add vue-google-oauth2
```

## Initialization
```javascript
//src/main.js
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: 'CLIENT_ID.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

```
Please Don't use `plus.login` scope. [It will be deprecated.](https://developers.google.com/identity/sign-in/web/quick-migration-guide)

### Options
| Property     | Type     | Required        | Description     |
|--------------|----------|-----------------|-----------------|
| clientId     | String   | Required.       | The app's client ID, found and created in the Google Developers Console. |
| scope        | String   | Optional.       | Default value is 'profile email' |
| prompt       | String   | Optional.       | [This value using for authCode.](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2offlineaccessoptions) The possible values are 'select_account' or 'consent'. Default value is 'select_account'. |

## Methods
| Property     | Description        | Type     |
|--------------|--------------------|----------|
| GoogleAuth   | return of gapi.auth2.getAuthInstance()   | Object |
| isAuthorized | Whether or not you have auth | Boolean  |
| isInit       | Whether or not api init | Boolean  |
| isLoaded     | Whether or not api init. will be deprecated. | Function  |
| signIn       | function for sign-in | Function  |
| getAuthCode  | function for getting authCode | Function  |
| signOut      | function for sign-out | Function  |

## Usage - Getting authorization code
>The `authCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access_token and refresh_token.

### Frontend-side(Vue.js)
```javascript
this.$gAuth.getAuthCode()
.then(authCode => {
  //on success
  return this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' })
})
.then(response => {
  //after ajax
})
.catch(error => {
  //on fail do something
})
```


### Backend-side(Golang)
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

### Backend-side(Python)
```python
# more info at https://developers.google.com/identity/sign-in/web/server-side-flow?authuser=1
from apiclient import discovery
import httplib2
from oauth2client import client

# (Receive auth_code by HTTPS POST)


# If this request does not have `X-Requested-With` header, this could be a CSRF
# if not request.headers.get('X-Requested-With'):
#    abort(403)

# Set path to the Web application client_secret_*.json file you downloaded from the
# Google API Console: https://console.developers.google.com/apis/credentials
CLIENT_SECRET_FILE = '/path/to/client_secret.json'

# Exchange auth code for access token, refresh token, and ID token
credentials = client.credentials_from_clientsecrets_and_code(
    CLIENT_SECRET_FILE,
    ['https://www.googleapis.com/auth/drive.appdata', 'profile', 'email'],
    auth_code)

# Get profile info from ID token
userid = credentials.id_token['sub']
email = credentials.id_token['email']
```


## Usage - Directly get back the access_token and id_token or use api request

```javascript
this.$gAuth.signIn()
.then(GoogleUser => {
  // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
  console.log('user', GoogleUser)
  this.isSignIn = this.$gAuth.isAuthorized
})
.catch(error  => {
  //on fail do something
})
```

refer to [google signIn reference : GoogleUser](https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid)

## Usage - Sign-out
Handling Google sign-out
```javascript
//you can use promise from v1.1.0 also
this.$gAuth.signOut()
.then(() => {
  // things to do when sign-out succeeds
})
.catch(error  => {
  // things to do when sign-out fails
})
```

## Additional Help
- [sample login page HTML file](https://github.com/guruahn/vue-google-oauth2/blob/master/sample.html).
- [Google API Client Libraries : Methods and Classes](https://developers.google.com/api-client-library/javascript/reference/referencedocs)
- If you are curious of how the entire Google sign-in flow works, please refer to the diagram below
![Google Sign-in Flow](http://i.imgur.com/BQPXKyT.png)
