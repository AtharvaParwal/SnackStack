# 📧 Email Notification Setup Guide

## Overview
SnackStack uses Gmail's SMTP service to send email notifications to buyers and vendors. This guide will help you set up Gmail integration for:

- Order confirmation emails to buyers
- 📱 Order status update notifications  
- 🔔 New order alerts to vendors
- 💳 Wallet transaction notifications

## 🚀 Quick Setup

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left panel
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process to enable 2FA

### Step 2: Generate App Password
1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left panel
3. Under "Signing in to Google", click **App passwords**
4. Click **Select app** and choose **Mail**
5. Click **Select device** and choose **Other (Custom name)**
6. Enter "SnackStack" as the custom name
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this for your .env file)

### Step 3: Configure Environment Variables
Create or update your `.env` file in the backend directory:

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### Step 4: Test the Setup
1. Start your backend server
2. Place a test order through the frontend
3. Check the console logs for email notifications
4. If configured correctly, you'll see: `[EMAIL] Order confirmation sent to...`
5. If not configured, you'll see: `⚠️ Gmail not configured...`

## 📋 Email Templates

### 1. Order Confirmation Email
- **Trigger**: When a customer places an order
- **Recipient**: Customer (buyer)
- **Content**: Order details, vendor info, next steps

### 2. Order Status Updates
- **Trigger**: When vendor updates order status
- **Recipient**: Customer (buyer)  
- **Content**: Status change, order details, action required (if any)

### 3. Vendor Notifications
- **Trigger**: When new order is placed
- **Recipient**: Vendor
- **Content**: Order details, customer info, dashboard link

### 4. Payment Notifications
- **Trigger**: Wallet transactions (debit/credit)
- **Recipient**: User (buyer/vendor)
- **Content**: Transaction details, wallet balance, wallet link

## 🔧 Technical Details

### Dependencies
- `nodemailer`: For sending emails via Gmail SMTP
- `gmail-send`: Used as fallback (if needed)

### Email Service Architecture
```
EmailNotificationService
├── createGmailTransporter() → Gmail SMTP setup
├── sendOrderConfirmation() → Order confirmation emails
├── sendStatusUpdate() → Status change notifications
├── sendVendorNotification() → New order alerts
└── sendPaymentNotification() → Wallet transaction emails
```

### Integration Points
- **Order Placement**: `/routes/Orders.js` → Place order endpoint
- **Status Updates**: `/routes/Orders.js` → Update status endpoint  
- **Wallet Transactions**: `/routes/Wallet.js` → Transaction endpoints

## 🎨 Email Templates Features

### Professional Styling
- Responsive design for mobile/desktop
- Color-coded status messages
- Emoji indicators for better UX
- Professional HTML layout

### Smart Content
- Dynamic status messages and colors
- Conditional action buttons
- Order-specific information
- Branded footer with SnackStack branding

### Fallback Handling
- Graceful degradation if Gmail not configured
- Console logging for development/debugging
- Error handling and logging

## 🔒 Security Best Practices

### Environment Variables
- **Never** commit Gmail credentials to version control
- Use separate Gmail account for production
- Regularly rotate app passwords
- Use different credentials for dev/staging/production

### Email Content
- No sensitive payment information in emails
- Sanitized user input in email templates
- Secure links to frontend dashboard

## 🛠️ Troubleshooting

### Common Issues

**1. "Invalid login" errors**
- Ensure 2FA is enabled on Gmail account
- Double-check app password (16 characters, no spaces)
- Verify GMAIL_USER matches the account with app password

**2. "Connection timeout" errors**
- Check internet connection
- Verify Gmail SMTP settings (smtp.gmail.com:587)
- Ensure firewall allows outbound SMTP traffic

**3. Emails not being sent**
- Check console logs for specific error messages
- Verify environment variables are loaded correctly
- Test with a simple nodemailer setup first

**4. Emails going to spam**
- Use proper "From" address (your Gmail account)
- Avoid spam trigger words in subject/content
- Consider setting up SPF/DKIM records for production

### Debug Mode
To enable detailed email debugging, add to your .env:
```env
NODE_ENV=development
DEBUG=nodemailer
```

## 🚀 Production Deployment

### Environment Setup
1. Use a dedicated Gmail account for production
2. Set up proper environment variables on your hosting platform
3. Configure FRONTEND_URL to your production domain
4. Monitor email delivery and error rates

### Scaling Considerations
- Gmail has daily sending limits (500 emails/day for free accounts)
- Consider upgrading to Gmail business or switching to dedicated email services
- Implement email queuing for high-volume applications
- Add email delivery tracking and analytics

## 📞 Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify your Gmail app password setup
3. Test with a minimal nodemailer configuration
4. Ensure environment variables are properly loaded

---

🎉 **Congratulations!** Your SnackStack email notification system is now ready to keep buyers and vendors informed about their orders!
