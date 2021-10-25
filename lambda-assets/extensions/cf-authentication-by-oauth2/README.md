# cf-authentication-by-oauth2

A lambda@edge function for Cloudfront enabling (and requiring) OAuth2 authentication.

## Azure AD

1. Register a new OAuth2 application in Azure AD.
2. Set the following values in the your `.env` file:
  
  ```
  CLIENT_DOMAIN="login.microsoftonline.com"
  CLIENT_ID="{YOUR_AZURE_APPLICATION_ID}"
  CLIENT_SECRET="{YOUR_AZURE_APPLICATION_CLIENT_SECRET}"
  
  AUTHORIZE_URL ="https://login.microsoftonline.com/{YOUR_AZURE_TENANT_ID}/oauth2/v2.0/authorize"
  AUTHORIZE_PARAMS="?response_type=code&scope=openid"
  AUTHORIZED_REDIRECTURI_SHOULD_MATCH=true

  CALLBACK_PATH="/callback"

  JWT_ALGORITHM="RS256"
  JWT_TOKEN_PATH="/{YOUR_AZURE_TENANT_ID}/oauth2/v2.0/token"
  JWKS_URI="https://login.microsoftonline.com/{YOUR_AZURE_TENANT_ID}/discovery/v2.0/keys"
  ```