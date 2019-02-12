package main

import (
	"fmt"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func main() {
	// auth_code is from frond-end side and only for one time use
	auth_code := "YOUR_AUTH_CODE"

	conf := &oauth2.Config{
		ClientID:     "YOUR_CLIENT_ID",
		ClientSecret: "YOUR_CLIENT_SECRET",
		RedirectURL:  "postmessage",
		Endpoint:     google.Endpoint,
	}

	// exchange to token inclued refresh_token from code
	token, err := conf.Exchange(oauth2.NoContext, auth_code)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	fmt.Printf("access_token: %s\n", token.AccessToken)
	fmt.Printf("refresh_token: %s\n", token.RefreshToken)
	fmt.Printf("time expirey: %s\n", token.Expiry)

}
