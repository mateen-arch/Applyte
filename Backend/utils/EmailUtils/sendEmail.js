require("dotenv").config();
const { Resend } = require("resend");

// Initialize Resend instance - will be created with API key when sendEmail is called
let resend = null;

const generateEmailHTML = (username, otp) => {
  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Reset styles for email clients */
    body, table, td, div, p, a { 
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      border: 0;
    }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #e5e5e5;
      background-color: #000000;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #000000;
    }
    
    .header {
      background: #262626;
      padding: 30px 20px;
      text-align: center;
      border: 1px solid #404040;
      border-radius: 12px 12px 0 0;
    }
    
    .logo {
      display: table;
      margin: 0 auto 15px auto;
    }
    
    .logo-cell {
      display: table-cell;
      vertical-align: middle;
    }
    
    .logo-icon {
      background: #404040;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #525252;
      display: inline-block;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #e5e5e5;
      margin-left: 12px;
    }
    
    .header h2 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    
    .content {
      background: #171717;
      padding: 40px 30px;
      border: 1px solid #404040;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
    
    .otp-container {
      background: #000000;
      padding: 30px;
      margin: 30px 0;
      border: 1px solid #525252;
      border-radius: 8px;
      text-align: center;
    }
    
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 8px;
      margin: 15px 0;
      font-family: Arial, sans-serif;
    }
    
    .expiry {
      color: #a3a3a3;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .footer {
      margin-top: 40px;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #737373;
      border-top: 1px solid #404040;
    }
    
    .username {
      color: #ffffff;
      font-weight: bold;
    }
    
    p {
      color: #d4d4d4;
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.6;
    }
    
    .note {
      background: #000000;
      padding: 15px;
      border: 1px solid #525252;
      border-radius: 6px;
      font-size: 14px;
      color: #a3a3a3;
      margin-top: 25px;
    }
    
    /* Mobile responsiveness */
    @media only screen and (max-width: 480px) {
      .container {
        padding: 10px;
      }
      
      .header {
        padding: 20px 15px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .otp-container {
        padding: 20px;
      }
      
      .otp {
        font-size: 24px;
        letter-spacing: 6px;
      }
      
      .logo-text {
        font-size: 20px;
      }
      
      .header h2 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="header">
          <div class="logo">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td class="logo-cell">
                  <div class="logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" stroke-width="2">
                      <path d="M12 19l-3-3H6l-1-1v-3l-3-3 3-3V6l1-1h3l3-3 3 3h3l1 1v3l3 3-3 3v3l-1 1h-3l-3 3z"/>
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                    </svg>
                  </div>
                </td>
                <td class="logo-cell">
                  <div class="logo-text">APPLYTE</div>
                </td>
              </tr>
            </table>
          </div>
          <h2>Account Verification</h2>
        </td>
      </tr>
    </table>
    
    <!-- Content Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="content">
          <p>Hello <span class="username">${username}</span>,</p>
          <p>Thank you for registering with APPLYTE. Use the OTP below to verify your account and start your journey to landing your dream job:</p>
          
          <!-- OTP Container -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="otp-container">
                <div class="otp">${otp}</div>
                <div class="expiry">This OTP will expire in 10 minutes</div>
              </td>
            </tr>
          </table>
          
          <p>Once verified, you'll have access to AI-powered job matching, resume optimization, and personalized cover letter generation.</p>
          
          <!-- Note Section -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="note">
                <p><strong>Note:</strong> If you didn't request this verification, please ignore this email or contact our support team immediately.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Footer Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="footer">
          <p>&copy; 2024 APPLYTE. All rights reserved.</p>
          <p>This email was sent as part of your account registration process.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

const sendEmail = async (email, username, otp) => {
  // LOG MODE - For development/testing without actual emails
  console.log("\n" + "━".repeat(60));
  console.log("📧 EMAIL SIMULATION MODE (Development)");
  console.log("━".repeat(60));
  console.log("To:", email);
  console.log("Username:", username);
  console.log("🔐 VERIFICATION OTP:", otp);
  console.log("⏰ Expires in: 1 hour");
  console.log("━".repeat(60) + "\n");
  
  // In development, always return true
  return true;
};

module.exports = { sendEmail };
