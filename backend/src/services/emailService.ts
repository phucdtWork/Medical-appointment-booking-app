// services/emailService.ts
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail", // hoặc "outlook", "yahoo", etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  // Send OTP Email
  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "Healthcare System",
        address: process.env.EMAIL_USER!,
      },
      to: email,
      subject: "Verify Your Email - OTP Code",
      html: this.getOTPEmailTemplate(otp),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new Error("Failed to send OTP email. Please try again.");
    }
  }

  // OTP Email Template
  private getOTPEmailTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #1890ff;
            margin: 0;
          }
          .otp-box {
            background-color: #fff;
            border: 2px dashed #1890ff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #1890ff;
            letter-spacing: 5px;
            margin: 10px 0;
          }
          .info {
            background-color: #e6f7ff;
            border-left: 4px solid #1890ff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          .warning {
            color: #ff4d4f;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
            <p>Thank you for registering with our Healthcare System</p>
          </div>

          <p>Hello,</p>
          <p>To complete your registration, please use the following One-Time Password (OTP):</p>

          <div class="otp-box">
            <p style="margin: 0; color: #666;">Your OTP Code:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 14px; color: #999;">
              This code will expire in 10 minutes
            </p>
          </div>

          <div class="info">
            <p style="margin: 0;"><strong>Important:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This OTP is valid for <strong>10 minutes</strong></li>
              <li>You have <strong>5 attempts</strong> to enter the correct OTP</li>
              <li>You can request a new OTP after <strong>60 seconds</strong></li>
            </ul>
          </div>

          <p class="warning">⚠️ Security Notice:</p>
          <ul>
            <li>Never share this OTP with anyone</li>
            <li>Our team will never ask for your OTP</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>

          <p>If you have any questions, please contact our support team.</p>

          <div class="footer">
            <p>© ${new Date().getFullYear()} MediBook System. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send Welcome Email (after successful registration)
  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    const mailOptions = {
      from: {
        name: "MediBook System",
        address: process.env.EMAIL_USER!,
      },
      to: email,
      subject: "Welcome to MediBook System!",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1890ff;">Welcome, ${fullName}! 🎉</h1>
            <p>Your account has been successfully created.</p>
            <p>You can now access all features of our MediBook System.</p>
            <p>Best regards,<br>MediBook Team</p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error for welcome email
    }
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service configuration error:", error);
      return false;
    }
  }

  // Send review reminder email after appointment completion
  async sendReviewReminder(
    email: string,
    patientName: string,
    doctorName: string,
    appointmentDate: string,
  ): Promise<void> {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "Healthcare System",
        address: process.env.EMAIL_USER!,
      },
      to: email,
      subject: `How was your appointment with ${doctorName}?`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#1890ff;">Hi ${patientName},</h2>
          <p>We hope your appointment with <strong>${doctorName}</strong> on <strong>${appointmentDate}</strong> went well.</p>
          <p>Please take a moment to rate your experience and leave a review to help others.</p>
          <p><a href="${process.env.FRONTEND_URL}/patient/reviews" target="_blank">Leave a review</a></p>
          <p>Thank you for using our service!</p>
          <p>— MediBook Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Review reminder sent to ${email}`);
    } catch (err) {
      console.error("Error sending review reminder:", err);
    }
  }
}
