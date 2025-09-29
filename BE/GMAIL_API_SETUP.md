# Gmail API Setup Guide

## Step 1: Enable Gmail API in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. **Add authorized redirect URIs** (this is important!):
   - Click "+ Add URI" 
   - Enter: `https://developers.google.com/oauthplayground`
   - **What this means**: This tells Google which websites are allowed to receive the authentication response. The OAuth Playground is Google's tool that helps us get the refresh token we need.
5. Save the Client ID and Client Secret

### 🔍 What are "Authorized Redirect URIs"?

When you use OAuth2 (the secure way to access Gmail), the process works like this:
1. Your app sends user to Google to log in
2. User logs in and gives permission
3. **Google redirects back to a specific URL with the authentication code**
4. That URL must be pre-approved in your OAuth settings

Since we're using Google's OAuth Playground tool to get our refresh token, we need to authorize `https://developers.google.com/oauthplayground` as a valid redirect destination.

## Step 3: Get Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret from Step 2
5. In the left panel, find "Gmail API v1"
6. Select `https://www.googleapis.com/auth/gmail.send`
7. Click "Authorize APIs"
8. Sign in with your Gmail account that matches EMAIL_USER
9. **IMPORTANT**: Click "Allow" to grant permissions
10. **You should see Step 2 appear** with an authorization code
11. Click "Exchange authorization code for tokens"
12. Copy the "Refresh token" (starts with `1//`)

### 🚨 Troubleshooting "invalid_grant" Error

If you get this error:
- **Go back to Step 1** and start over
- Make sure your **Client ID and Secret** are correct
- The authorization code **expires in 10 minutes** - work quickly!
- Make sure you're signed into the **same Gmail account** as EMAIL_USER
- Don't refresh the page or go back during the process

## Step 4: Environment Variables

Add these to your Railway environment variables:

```env
EMAIL_USER=your-gmail@gmail.com
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token

# Keep these as fallback
EMAIL_PASS=your-app-password
```

## 📸 Visual Guide for Redirect URI

When you're creating OAuth credentials, you'll see a form like this:

```
Name: [Your app name]
Authorized JavaScript origins: (leave empty)
Authorized redirect URIs: 
  [+ ADD URI] https://developers.google.com/oauthplayground
```

**Why do we need this?**
- The OAuth Playground is a Google tool that helps us generate the refresh token
- Without adding this URI, Google will reject the authentication request
- Think of it as telling Google "yes, it's okay to send the auth code to this specific website"

## ⚠️ Common Issues

1. **"redirect_uri_mismatch" error**: You forgot to add the OAuth Playground URL
2. **"invalid_client" error**: Double-check your Client ID and Secret
3. **"insufficient_scope" error**: Make sure you selected the Gmail send scope
4. **"invalid_grant" error**: Authorization code expired or already used - start over from Step 1
5. **"Bad Request" error**: Usually means wrong Client ID/Secret or expired code

## 🔄 Alternative: Service Account Method (Easier)

If OAuth2 keeps failing, we can use a Service Account instead:

1. In Google Cloud Console → "IAM & Admin" → "Service Accounts"
2. Create a service account
3. Download the JSON key file
4. Enable domain-wide delegation
5. Add to Railway as `GMAIL_SERVICE_ACCOUNT_KEY` (base64 encoded)

## How it Works

1. **Primary Method**: Uses Gmail API with OAuth2 refresh token
   - More reliable for cloud deployments
   - No SMTP port blocking issues
   - Higher rate limits

2. **Fallback Method**: Uses Gmail SMTP with app password
   - If Gmail API fails, automatically falls back
   - Same as your original setup

## Benefits

- ✅ No SMTP port blocking on Railway
- ✅ Higher rate limits (1 billion requests/day)
- ✅ More secure OAuth2 authentication
- ✅ Automatic fallback to app password method
- ✅ Better error handling and logging

## Testing

After setting up the environment variables, deploy to Railway and test the password change functionality. Check the logs to see which method is being used.