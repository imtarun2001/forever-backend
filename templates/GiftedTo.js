const giftedToTemplate = (name,giftedFrom,email,orderId,date) => {
    return `
    <!DOCTYPE html>
        <html>
            <head>
            <meta charset="UTF-8">
            <title>Order Placed</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9f9; padding:20px 0;">
                    <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                        
                        <tr>
                            <td style="background-color:#000000; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
                            Thank You for Your Order!
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding:30px;">
                            <p style="font-size:16px; margin:0 0 15px;">Hi ${name.split(' ').shift()},</p>
                            <p style="font-size:16px; margin:0 0 20px;">
                                We’re excited to let you know that ${giftedFrom} has sent you gift(s).  
                                Here are the details:
                            </p>

                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin-bottom:20px;">
                                <tr>
                                <td style="border-bottom:1px solid #ddd; padding:10px; font-weight:bold;">E-Mail associated:</td>
                                <td style="border-bottom:1px solid #ddd; padding:10px;">${email}</td>
                                </tr>
                                <tr>
                                <td style="border-bottom:1px solid #ddd; padding:10px; font-weight:bold;">Order ID:</td>
                                <td style="border-bottom:1px solid #ddd; padding:10px;">${orderId}</td>
                                </tr>
                                <tr>
                                <td style="border-bottom:1px solid #ddd; padding:10px; font-weight:bold;">Order Date:</td>
                                <td style="border-bottom:1px solid #ddd; padding:10px;">${date}</td>
                                </tr>
                            </table>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f4f4f4; text-align:center; padding:20px; font-size:12px; color:#777;">
                            © 2025 Forever🤍🛍️. All rights reserved.
                            </td>
                        </tr>
                        
                        </table>
                    </td>
                    </tr>
                </table>
            </body>
        </html>
  `;
};

module.exports = giftedToTemplate;
