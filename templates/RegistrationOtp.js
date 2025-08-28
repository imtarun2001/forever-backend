const registrationOtpTemplate = (otp) => {
    return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your Email</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:20px; text-align:center; background-color:#e91e63; color:#ffffff; border-radius:8px 8px 0 0;">
              <h2>OTP from Forever🤍🛍️</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333333; text-align:center;">
              <p style="font-size:16px;">Use the following OTP to verify your email:</p>
              <h1 style="font-size:32px; letter-spacing:5px; margin:20px 0; color:#e91e63;">${otp}</h1>
              <p style="font-size:14px; color:#666;">This OTP is valid for the next 5 minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; background-color:#f9f9f9; text-align:center; font-size:12px; color:#888;">
              © Forever🤍🛍️ 2025. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

module.exports = registrationOtpTemplate;