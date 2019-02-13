package main

import (
	"fmt"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func main() {
	// authCode is from frond-end side and only for one time use
	authCode := "YOUR_AUTH_CODE"

	conf := &oauth2.Config{
		ClientID:     "YOUR_CLIENT_ID",
		ClientSecret: "YOUR_CLIENT_SECRET",
		RedirectURL:  "postmessage",
		Endpoint:     google.Endpoint,
	}

	// exchange auth_code to token including refresh_token
	token, err := conf.Exchange(oauth2.NoContext, authCode)

	if err != nil {
		fmt.Printf("%s\n", err.Error())
		return
	}

	fmt.Printf("access_token: %s\n", token.AccessToken)
	fmt.Printf("refresh_token: %s\n", token.RefreshToken)
	fmt.Printf("time expirey: %s\n", token.Expiry)

}
