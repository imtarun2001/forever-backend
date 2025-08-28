const accountCreationTemplate = (name) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Account Created</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:20px; text-align:center; background-color:#4CAF50; color:#ffffff; border-radius:8px 8px 0 0;">
              <h2>🎉 Welcome to Forever🤍🛍️, ${name.split(' ').shift()}!</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333333; text-align:center;">
              <p style="font-size:16px;">Your account has been created successfully.</p>
              <p style="font-size:14px; color:#666; margin-top:15px;">Explore thousands of products, save your favorites and enjoy a seamless shopping experience.</p>
              <a href="https://forever-frontend-eight-xi.vercel.app/" 
                style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#4CAF50; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
                Start Shopping 🛍️
              </a>
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
};

module.exports = accountCreationTemplate;
