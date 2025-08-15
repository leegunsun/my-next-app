# Dev Gate - Development Access Control

This feature provides a temporary access control system for the development phase, allowing only authenticated master accounts to access the application while showing an "Under Development" page to other users.

## Setup

### 1. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Set your master account email
NEXT_PUBLIC_MASTER_EMAIL=your-admin-email@example.com
```

### 2. Create Master Account in Firebase

1. Go to Firebase Console > Authentication
2. Add a user with the email specified in `NEXT_PUBLIC_MASTER_EMAIL`
3. Set a secure password

## How It Works

1. **Authentication Check**: The `DevGateWrapper` component checks if a user is authenticated
2. **Master Account Verification**: Only the email specified in `NEXT_PUBLIC_MASTER_EMAIL` can access the app
3. **Under Development Page**: All other visitors see a professional "Under Development" page
4. **Admin Login**: Hidden admin login accessible through the "관리자 로그인" button

## Features

- 🔒 Firebase Authentication integration
- 🎨 Professional "Under Development" UI
- 🚪 Hidden admin login portal
- 📱 Fully responsive design
- 🗑️ Easy to remove when going to production

## Removing Dev Gate (When Ready for Production)

To completely remove the dev-gate feature:

1. Remove the `DevGateLayout` import and usage from `/app/layout.tsx`:
   ```tsx
   // Remove this import
   import DevGateLayout from "./dev-gate/DevGateLayout";
   
   // Remove the <DevGateLayout> wrapper from the JSX
   ```

2. Delete the entire `/app/dev-gate/` folder

3. Remove the `NEXT_PUBLIC_MASTER_EMAIL` from your environment variables

That's it! The feature is completely isolated and can be removed with these simple steps.

## Security Notes

- Never commit real credentials to version control
- Use strong passwords for the master account
- Consider adding additional security measures like IP whitelisting for production
- Enable 2FA on your Firebase master account

## Troubleshooting

### Login Not Working
- Verify the email in `NEXT_PUBLIC_MASTER_EMAIL` matches your Firebase user
- Check Firebase Console for authentication errors
- Ensure Firebase configuration is correct in `.env.local`

### Page Not Loading
- Check browser console for errors
- Verify all Firebase environment variables are set
- Ensure Firebase project has Authentication enabled