# Portfolio Contact Form Setup

## Email Configuration

Your contact form is now functional! To complete the setup:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Email Service

#### Option A: Using Gmail (Recommended)

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Google will generate a 16-character password
   - Copy this password

3. **Create `.env.local` file** in your project root:
```env
EMAIL_USER=bakpobatombari@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

#### Option B: Using Other Email Services

For Outlook/Hotmail, use this configuration in `/pages/api/contact.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

For custom SMTP:
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Step 3: Add `.env.local` to `.gitignore`

Make sure `.env.local` is in your `.gitignore` file to keep credentials secure.

### Step 4: Deploy to Vercel

When deploying to Vercel, add environment variables:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add:
   - `EMAIL_USER`: your email address
   - `EMAIL_PASSWORD`: your app password

## Features Implemented

✅ Complete contact form with validation
✅ Email sending via Nodemailer
✅ Success/error feedback modals
✅ Loading states during submission
✅ Form reset after successful submission
✅ Professional HTML email template
✅ Reply-to functionality for easy responses

## Testing Locally

1. Start development server:
```bash
npm run dev
```

2. Navigate to the contact page
3. Fill out and submit the form
4. Check your email inbox for the message

## Security Notes

- Never commit `.env.local` to Git
- Use app-specific passwords, not your main email password
- Consider rate limiting for production (add middleware to prevent spam)

## Troubleshooting

If emails aren't sending:
- Verify environment variables are set correctly
- Check that 2-Step Verification is enabled (for Gmail)
- Ensure the app password is correct
- Check console logs for error messages
- Verify your email service allows SMTP access
