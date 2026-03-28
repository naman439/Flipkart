/**
 * Email Service
 * Sends transactional emails using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter (configured from environment variables)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send order confirmation email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {object} order - Order details
 */
const sendOrderConfirmationEmail = async (to, name, order) => {
  // Skip if email credentials not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email credentials not configured, skipping email...');
    return;
  }

  const transporter = createTransporter();

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: #2874f0; color: white; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Flipkart</h1>
          <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Order Confirmed!</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
          <p style="color: #555;">Thank you for your order! Your order has been confirmed and will be delivered soon.</p>
          
          <!-- Order Info -->
          <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Order ID</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2874f0;">#${order.id}</p>
          </div>
          
          <!-- Order Items -->
          <h3 style="color: #333; margin: 24px 0 12px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f4f4f4;">
                <th style="padding: 10px; text-align:left; font-size:13px; color:#666;">Product</th>
                <th style="padding: 10px; text-align:center; font-size:13px; color:#666;">Qty</th>
                <th style="padding: 10px; text-align:right; font-size:13px; color:#666;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          
          <!-- Total -->
          <div style="text-align: right; margin-top: 16px; padding-top: 16px; border-top: 2px solid #2874f0;">
            <p style="font-size: 18px; font-weight: 700; color: #333;">
              Total: ₹${order.finalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          
          <p style="color: #555; margin-top: 24px;">
            Estimated delivery: <strong>3-5 business days</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 16px 32px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            © 2024 Flipkart Clone. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Flipkart Clone" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed! #${order.id} - Flipkart Clone`,
    html,
  });

  console.log(`📧 Order confirmation email sent to ${to}`);
};

module.exports = { sendOrderConfirmationEmail };
