# python example for the exchange of auth code to refresh token
# Reference: https://oauth2client.readthedocs.io/en/latest/source/oauth2client.client.html#

from oauth2client import client

CLIENT_ID = 'YOUR_CLIENT_ID'

CLIENT_SECRET = 'YOUR_CLIENT_SECRET'


if __name__ == "__main__":
    auth_code = 'auth_code_from_client'

    try:
        credentials = client.credentials_from_code(CLIENT_ID, CLIENT_SECRET, scope='', code=auth_code)
    except client.FlowExchangeError as e:
        print(e)
    else:
        print('refresh_token:', credentials.refresh_token)
        print('access_token:', credentials.access_token)
        print('token_expiry:', credentials.token_expiry)
