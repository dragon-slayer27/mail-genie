# Gmail OAuth Setup Guide

To use the direct email sending feature in **Mail Genie**, you need to connect your own Gmail account using Google's OAuth2. This process ensures that Mail Genie can securely send emails on your behalf without ever seeing your password.

Because Mail Genie is an open-source desktop app running locally on your machine, you must create your own Google Cloud Project and generate your own OAuth Credentials. 

Follow these steps to set it up:

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. Click the **Project Dropdown** at the top left of the screen (next to the Google Cloud logo).
4. Click **New Project**.
5. Name your project something recognizable (e.g., `Mail Genie Desktop`) and click **Create**.
6. Make sure your newly created project is selected in the project dropdown.

## Step 2: Enable the Gmail API
1. In the left-hand menu, go to **APIs & Services > Library**.
2. Search for **"Gmail API"**.
3. Click on the **Gmail API** result.
4. Click the **Enable** button.

## Step 3: Configure the OAuth Consent Screen
1. In the left-hand menu, navigate to **APIs & Services > OAuth consent screen**.
2. Choose **External** user type and click **Create**.
3. Fill in the required fields:
   - **App name:** `Mail Genie`
   - **User support email:** (Your email)
   - **Developer contact information:** (Your email)
4. Click **Save and Continue**.
5. **Scopes**: You do not need to manually add scopes here for testing purposes. Click **Save and Continue**.
6. **Test Users**: Since your app will be in "Testing" mode (unpublished), you **must** add the email addresses you intend to use with the app.
   - Click **Add Users**.
   - Type in your Gmail address.
   - Click **Save and Continue**.

## Step 4: Create Desktop OAuth Credentials
1. In the left-hand menu, go to **APIs & Services > Credentials**.
2. Click **Create Credentials** at the top and select **OAuth client ID**.
3. For the **Application type** dropdown, select **Desktop app**.
4. Name it (e.g., `Mail Genie Desktop Client`) and click **Create**.
5. A modal will appear displaying your **Client ID** and **Client Secret**. Keep this window open or copy them securely.

## Step 5: Connect Mail Genie
1. Open the **Mail Genie** desktop application.
2. Navigate to the **Settings** page.
3. In the Google OAuth section, paste your **Client ID** and **Client Secret**.
4. Click the **Connect Gmail** button.
5. A Google sign-in window will open in your default browser.
6. Select the Gmail account you added as a test user in Step 3.
7. *Note: You may see a "Google hasn’t verified this app" warning because your project is unpublished. Click **Advanced** and then **Go to Mail Genie (unsafe)**.*
8. Grant the required permissions to send emails.
9. You will be redirected back to the Mail Genie app, and the button will turn green indicating success!

---

> [!TIP]
> **Need help with the Gemini API?**
> To generate the emails using AI, you also need a Gemini API Key. You can get one for free from Google AI Studio at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
