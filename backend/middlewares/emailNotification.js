// backend/middlewares/emailNotification.js
const nodemailer = require('nodemailer');

// Gmail configuration
const createGmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_APP_PASSWORD 
        }
    });
};

// Email notification service using Gmail
class EmailNotificationService {
    static async sendOrderConfirmation(orderData) {
        try {
            const transporter = createGmailTransporter();
            
            const emailContent = {
                from: process.env.GMAIL_USER || 'your-email@gmail.com',
                to: orderData.email,
                subject: `🍽️ Order Confirmation - ${orderData.item} from ${orderData.canteen}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #2196f3; text-align: center;">🍽️ Order Confirmed!</h2>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
                            <p><strong>Order ID:</strong> ${orderData._id}</p>
                            <p><strong>Item:</strong> ${orderData.item}</p>
                            <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                            <p><strong>Vendor:</strong> ${orderData.canteen}</p>
                            <p><strong>Total Amount:</strong> ₹${orderData.cost}</p>
                            ${orderData.addons && orderData.addons.length > 0 ? 
                                `<p><strong>Add-ons:</strong> ${orderData.addons.map(addon => addon.addon).join(', ')}</p>` : ''
                            }
                        </div>
                        
                        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #4caf50; margin-top: 0;">📋 What's Next?</h3>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>Your order is being prepared by ${orderData.canteen}</li>
                                <li>You'll receive updates as your order progresses</li>
                                <li>Estimated preparation time: 15-30 minutes</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #666; margin: 0;">Thank you for choosing SnackStack! 🙏</p>
                            <p style="color: #666; margin: 0; font-size: 14px;">Questions? Contact us or visit your vendor directly.</p>
                        </div>
                    </div>
                `
            };

            // Only send actual email if Gmail credentials are configured
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
                await transporter.sendMail(emailContent);
                console.log(`[EMAIL] Order Confirmation sent to ${orderData.email}`);
            } else {
                console.log(`📧 [EMAIL] Order Confirmation sent to ${orderData.email}`);
                console.log(`   ⚠️  Gmail not configured - Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables`);
            }
            
            console.log(`   Order ID: ${orderData._id}`);
            console.log(`   Items: ${orderData.item}`);
            console.log(`   Total: ₹${orderData.cost}`);
            console.log(`   Vendor: ${orderData.canteen}`);
            
            return { success: true, message: "Order confirmation email sent" };
        } catch (err) {
            console.error("Email notification error:", err.message);
            return { success: false, error: err.message };
        }
    }

    static async sendStatusUpdate(orderData, newStatus) {
        try {
            const transporter = createGmailTransporter();
            
            const statusMessages = {
                'PLACED': '📝 Your order has been placed successfully',
                'ACCEPTED': 'Your order has been confirmed and is being prepared',
                'COOKING': '�‍🍳 Your order is now being prepared',
                'READY FOR PICKUP': '🔔 Your order is ready for pickup!',
                'COMPLETED': 'Your order has been completed. Enjoy your meal!',
                'REJECTED': 'Sorry, your order has been cancelled'
            };

            const statusColors = {
                'PLACED': '#2196f3',
                'ACCEPTED': '#4caf50', 
                'COOKING': '#ff9800',
                'READY FOR PICKUP': '#9c27b0',
                'COMPLETED': '#8bc34a',
                'REJECTED': '#f44336'
            };

            const statusEmojis = {
                'PLACED': '📝',
                'ACCEPTED': '✅',
                'COOKING': '👨‍🍳',
                'READY FOR PICKUP': '🔔',
                'COMPLETED': '🎉',
                'REJECTED': '❌'
            };
            
            const emailContent = {
                from: process.env.GMAIL_USER || 'your-email@gmail.com',
                to: orderData.email,
                subject: `${statusEmojis[newStatus] || '📋'} Order Update - ${orderData.item}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: ${statusColors[newStatus] || '#333'}; text-align: center;">
                            ${statusEmojis[newStatus] || '📋'} Order Status Update
                        </h2>
                        
                        <div style="background-color: ${statusColors[newStatus] || '#f5f5f5'}20; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColors[newStatus] || '#333'};">
                            <h3 style="color: ${statusColors[newStatus] || '#333'}; margin-top: 0;">
                                ${statusMessages[newStatus] || 'Order status updated'}
                            </h3>
                        </div>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
                            <p><strong>Order ID:</strong> ${orderData._id}</p>
                            <p><strong>Item:</strong> ${orderData.item}</p>
                            <p><strong>Vendor:</strong> ${orderData.canteen}</p>
                            <p><strong>Current Status:</strong> <span style="color: ${statusColors[newStatus] || '#333'}; font-weight: bold;">${newStatus}</span></p>
                        </div>
                        
                        ${newStatus === 'READY FOR PICKUP' ? `
                            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                                <h3 style="color: #856404; margin-top: 0;">🏃‍♂️ Action Required</h3>
                                <p style="margin: 0; color: #856404;">Please pick up your order from <strong>${orderData.canteen}</strong> as soon as possible!</p>
                            </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #666; margin: 0;">Thank you for choosing SnackStack! 🙏</p>
                            <p style="color: #666; margin: 0; font-size: 14px;">Questions? Contact ${orderData.canteen} directly.</p>
                        </div>
                    </div>
                `
            };

            // Only send actual email if Gmail credentials are configured
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
                await transporter.sendMail(emailContent);
                console.log(`[EMAIL] Status Update sent to ${orderData.email}`);
            } else {
                console.log(`📧 [EMAIL] Status Update sent to ${orderData.email}`);
                console.log(`   ⚠️  Gmail not configured - Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables`);
            }
            
            console.log(`   Order ID: ${orderData._id}`);
            console.log(`   New Status: ${newStatus}`);
            console.log(`   Vendor: ${orderData.canteen}`);
            console.log(`   Message: ${statusMessages[newStatus] || 'Order status updated'}`);
            
            return { success: true, message: "Status update email sent" };
        } catch (err) {
            console.error("Status update email error:", err.message);
            return { success: false, error: err.message };
        }
    }

    static async sendVendorNotification(vendorData, orderData) {
        try {
            const transporter = createGmailTransporter();
            
            const emailContent = {
                from: process.env.GMAIL_USER || 'your-email@gmail.com',
                to: vendorData.email,
                subject: `🔔 New Order Received - ${orderData.item}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #4caf50; text-align: center;">🍽️ New Order Alert!</h2>
                        
                        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                            <h3 style="color: #4caf50; margin-top: 0;">New order received at ${vendorData.shopName}</h3>
                        </div>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
                            <p><strong>Order ID:</strong> ${orderData._id}</p>
                            <p><strong>Item:</strong> ${orderData.item}</p>
                            <p><strong>Customer Email:</strong> ${orderData.email}</p>
                            <p><strong>Order Time:</strong> ${new Date(orderData.timestamp).toLocaleString()}</p>
                            <p><strong>Total Amount:</strong> ₹${orderData.cost}</p>
                            <p><strong>Status:</strong> <span style="color: #2196f3; font-weight: bold;">PLACED</span></p>
                        </div>
                        
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                            <h3 style="color: #856404; margin-top: 0;">👨‍🍳 Action Required</h3>
                            <p style="margin: 0; color: #856404;">Please log into your vendor dashboard to accept or reject this order promptly.</p>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor-dashboard" 
                               style="display: inline-block; background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                🚀 Go to Dashboard
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #666; margin: 0;">SnackStack Vendor Portal 🏪</p>
                            <p style="color: #666; margin: 0; font-size: 14px;">Quick action required to keep customers happy!</p>
                        </div>
                    </div>
                `
            };

            // Only send actual email if Gmail credentials are configured
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
                await transporter.sendMail(emailContent);
                console.log(`[EMAIL] New Order Alert sent to vendor: ${vendorData.email}`);
            } else {
                console.log(`📧 [EMAIL] New Order Alert sent to vendor: ${vendorData.email}`);
                console.log(`   ⚠️  Gmail not configured - Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables`);
            }
            
            console.log(`   Shop: ${vendorData.shopName}`);
            console.log(`   Order from: ${orderData.email}`);
            console.log(`   Items: ${orderData.item}`);
            console.log(`   Total: ₹${orderData.cost}`);
            
            return { success: true, message: "Vendor notification email sent" };
        } catch (err) {
            console.error("Vendor notification error:", err.message);
            return { success: false, error: err.message };
        }
    }

    static async sendPaymentNotification(email, amount, type = 'debit') {
        try {
            const transporter = createGmailTransporter();
            
            const typeData = {
                'debit': {
                    color: '#f44336',
                    emoji: '💳',
                    title: 'Payment Deducted',
                    message: 'Amount has been deducted from your wallet'
                },
                'credit': {
                    color: '#4caf50',
                    emoji: '💰',
                    title: 'Payment Received',
                    message: 'Amount has been added to your wallet'
                }
            };
            
            const paymentInfo = typeData[type] || typeData['debit'];
            
            const emailContent = {
                from: process.env.GMAIL_USER || 'your-email@gmail.com',
                to: email,
                subject: `${paymentInfo.emoji} Wallet ${type.charAt(0).toUpperCase() + type.slice(1)} - ₹${amount}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: ${paymentInfo.color}; text-align: center;">
                            ${paymentInfo.emoji} ${paymentInfo.title}
                        </h2>
                        
                        <div style="background-color: ${paymentInfo.color}20; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${paymentInfo.color};">
                            <h3 style="color: ${paymentInfo.color}; margin-top: 0;">
                                ${paymentInfo.message}
                            </h3>
                        </div>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Transaction Details:</h3>
                            <p><strong>Type:</strong> <span style="color: ${paymentInfo.color}; font-weight: bold;">${type.toUpperCase()}</span></p>
                            <p><strong>Amount:</strong> ₹${amount}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                            <p><strong>Account:</strong> ${email}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/wallet" 
                               style="display: inline-block; background-color: ${paymentInfo.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                💼 View Wallet
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #666; margin: 0;">SnackStack Wallet 💳</p>
                            <p style="color: #666; margin: 0; font-size: 14px;">Secure and instant transactions</p>
                        </div>
                    </div>
                `
            };

            // Only send actual email if Gmail credentials are configured
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
                await transporter.sendMail(emailContent);
                console.log(`[EMAIL] Payment Notification sent to ${email}`);
            } else {
                console.log(`📧 [EMAIL] Payment Notification sent to ${email}`);
                console.log(`   ⚠️  Gmail not configured - Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables`);
            }
            
            console.log(`   Type: ${type.toUpperCase()}`);
            console.log(`   Amount: ₹${amount}`);
            
            return { success: true, message: "Payment notification email sent" };
        } catch (err) {
            console.error("Payment notification error:", err.message);
            return { success: false, error: err.message };
        }
    }
}

// Middleware to send notifications after order operations
function sendOrderNotifications(req, res, next) {
    // Store the original res.json to intercept successful responses
    const originalJson = res.json;
    
    res.json = function(data) {
        // Only send notifications on successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
            // Send notifications in background (don't wait)
            setImmediate(async () => {
                try {
                    if (req.route.path === '/placeorder' && req.method === 'POST') {
                        await EmailNotificationService.sendOrderConfirmation(data);
                        
                        // Also notify vendor if we have vendor data
                        if (req.validationData && req.validationData.vendor) {
                            await EmailNotificationService.sendVendorNotification(
                                req.validationData.vendor, 
                                data
                            );
                        }
                    } else if (req.route.path === '/updatestatus' && req.method === 'POST') {
                        await EmailNotificationService.sendStatusUpdate(data, req.body.status);
                    }
                } catch (err) {
                    console.error("Background notification error:", err);
                }
            });
        }
        
        // Call original res.json
        return originalJson.call(this, data);
    };
    
    next();
}

module.exports = {
    EmailNotificationService,
    sendOrderNotifications
};
