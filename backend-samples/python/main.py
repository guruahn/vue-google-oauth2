# Python example for the exchange of auth code to refresh token
# Reference: https://google-auth-oauthlib.readthedocs.io/en/latest/reference/google_auth_oauthlib.flow.html
from google_auth_oauthlib.flow import Flow
from oauthlib.oauth2.rfc6749.errors import OAuth2Error

CLIENT_SECRETS_FILE = 'YOUR_CLIENT_SECRETS_FILE'  # get this from https://console.cloud.google.com/apis/credentials

SCOPES = "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"  # example scopes

# reference for convenience
def credentials_to_dict(credObject):
    return {'token': credObject.token,
            'refresh_token': credObject.refresh_token,
            'token_uri': credObject.token_uri,
            'client_id': credObject.client_id,
            'client_secret': credObject.client_secret,
            'scopes': credObject.scopes}

if __name__ == "__main__":
    auth_code = 'auth_code_from_client'

    flow = Flow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES, redirect_uri="postmessage")
    try:
        flow.fetch_token(code=auth_code)
    except OAuth2Error:
        # error handling, for example InvalidGrantError for malformed auth_code
        print('An error occured')

    credentials = flow.credentials

    print('access_token:', credentials.token)
    print('refresh_token:', credentials.refresh_token)