namespace Vorder.Domain.Constants
{
    public static class EmailConstants
    {
        public static string ConfirmationSubject = "Confirm your email";
        public static string ResetPasswordSubject = "Reset your password";

        public static string GetConfirmationEmailBody(string token) => $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            </head>
            <body style='margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f7; padding: 40px 0;'>
                    <tr>
                        <td align='center'>
                            <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;'>
                                <!-- Header -->
                                <tr>
                                    <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;'>
                                        <h1 style='margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;'>Email Verification</h1>
                                    </td>
                                </tr>
                    
                                <!-- Content -->
                                <tr>
                                    <td style='padding: 40px;'>
                                        <p style='margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;'>
                                            Hello,
                                        </p>
                                        <p style='margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;'>
                                            Thank you for signing up! Please use the verification code below to confirm your email address:
                                        </p>
                            
                                        
                            <!-- OTP Box -->
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td align='center' style='padding: 20px 0;'>
                                        <div style='background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; display: inline-block; min-width: 280px;'>
                                            <p style='margin: 0 0 15px; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;'>
                                                Your Verification Code
                                            </p>
                                            <input type='text' 
                                                   value='{token}' 
                                                   readonly 
                                                   onclick='this.select(); this.setSelectionRange(0, 99999);'
                                                   style='width: 100%;
                                                          max-width: 240px;
                                                          padding: 12px;
                                                          font-size: 28px;
                                                          font-weight: 700;
                                                          letter-spacing: 6px;
                                                          font-family: ""Courier New"", monospace;
                                                          color: #667eea;
                                                          background-color: #ffffff;
                                                          border: 2px solid #667eea;
                                                          border-radius: 6px;
                                                          text-align: center;
                                                          cursor: pointer;
                                                          outline: none;' />
                                            <p style='margin: 12px 0 0; color: #999999; font-size: 11px;'>
                                                👆 Select all and copy
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                                        <p style='margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;'>
                                            If you didn't request this verification, please ignore this email.
                                        </p>
                                    </td>
                                </tr>
                    
                                <!-- Footer -->
                                <tr>
                                    <td style='background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;'>
                                        <p style='margin: 0; color: #999999; font-size: 12px; line-height: 1.5;'>
                                            © 2025 Vorder. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>";

        public static string GetResetPasswordBody(string token) => $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            </head>
            <body style='margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f7; padding: 40px 0;'>
                    <tr>
                        <td align='center'>
                            <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;'>
                                <!-- Header -->
                                <tr>
                                    <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;'>
                                        <h1 style='margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;'>Password Reset</h1>
                                    </td>
                                </tr>
                    
                                <!-- Content -->
                                <tr>
                                    <td style='padding: 40px;'>
                                        <p style='margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;'>
                                            Hello,
                                        </p>
                                       
                                        
                            <!-- OTP Box -->
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td align='center' style='padding: 20px 0;'>
                                        <div style='background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; display: inline-block; min-width: 280px;'>
                                            <p style='margin: 0 0 15px; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;'>
                                                Your Verification Code
                                            </p>
                                            <input type='text' 
                                                   value='{token}' 
                                                   readonly 
                                                   onclick='this.select(); this.setSelectionRange(0, 99999);'
                                                   style='width: 100%;
                                                          max-width: 240px;
                                                          padding: 12px;
                                                          font-size: 28px;
                                                          font-weight: 700;
                                                          letter-spacing: 6px;
                                                          font-family: ""Courier New"", monospace;
                                                          color: #667eea;
                                                          background-color: #ffffff;
                                                          border: 2px solid #667eea;
                                                          border-radius: 6px;
                                                          text-align: center;
                                                          cursor: pointer;
                                                          outline: none;' />
                                            <p style='margin: 12px 0 0; color: #999999; font-size: 11px;'>
                                                👆 Select all and copy
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                                        <p style='margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;'>
                                            If you didn't request this Reset, please ignore this email.
                                        </p>
                                    </td>
                                </tr>
                    
                                <!-- Footer -->
                                <tr>
                                    <td style='background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;'>
                                        <p style='margin: 0; color: #999999; font-size: 12px; line-height: 1.5;'>
                                            © 2025 Vorder. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>";
    }
}
