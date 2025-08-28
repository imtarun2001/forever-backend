const passwordResetTemplate = (resetLink) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:20px; text-align:center; background-color:#3f51b5; color:#ffffff; border-radius:8px 8px 0 0;">
              <h2>Password Reset Request 🔒</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333333; text-align:center;">
              <p style="font-size:16px;">We received a request to reset your password.</p>
              <p style="font-size:16px;">Click the button below to reset it:</p>
              <a href="${resetLink}" style="display:inline-block; padding:12px 24px; margin:20px 0; font-size:16px; color:#ffffff; background-color:#3f51b5; border-radius:6px; text-decoration:none;">Reset Password</a>
              <p style="font-size:14px; color:#666;">This link is valid for 15 minutes. If you didn’t request a reset, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; background-color:#f9f9f9; text-align:center; font-size:12px; color:#888;">
              © 2025 Forever🤍🛍️. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

module.exports = passwordResetTemplate;