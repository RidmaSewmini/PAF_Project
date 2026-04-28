package backend.email;

public class EmailTemplates {

    public static final String VERIFICATION_EMAIL_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { text-align: center; margin-bottom: 20px; }
                .code-box { background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
                .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Verify Your Email</h2>
                </div>
                <p>Hello,</p>
                <p>Thank you for registering! Please use the verification code below to complete your registration:</p>
                <div class="code-box">{verificationCode}</div>
                <p>This code will expire in a short while.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <div class="footer">
                    &copy; CampusFlow Team
                </div>
            </div>
        </body>
        </html>
        """;

    public static final String WELCOME_EMAIL_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { text-align: center; margin-bottom: 20px; }
                .btn { display: inline-block; padding: 10px 20px; color: #fff; background-color: #5b3cdd; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Welcome to CampusFlow, {firstName}!</h2>
                </div>
                <p>We are thrilled to have you on board.</p>
                <p>You can now explore the platform and manage your campus resources seamlessly.</p>
                <div style="text-align: center;">
                    <a href="{loginURL}" class="btn">Login to Your Account</a>
                </div>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <div class="footer">
                    &copy; CampusFlow Team
                </div>
            </div>
        </body>
        </html>
        """;

    public static final String PASSWORD_RESET_REQUEST_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { text-align: center; margin-bottom: 20px; }
                .btn { display: inline-block; padding: 10px 20px; color: #fff; background-color: #e53e3e; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Password Reset Request</h2>
                </div>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to choose a new password:</p>
                <div style="text-align: center;">
                    <a href="{resetURL}" class="btn">Reset Password</a>
                </div>
                <p>If you did not request a password reset, please ignore this email. This link will expire shortly.</p>
                <div class="footer">
                    &copy; CampusFlow Team
                </div>
            </div>
        </body>
        </html>
        """;

    public static final String PASSWORD_RESET_SUCCESS_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { text-align: center; margin-bottom: 20px; }
                .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Password Reset Successful</h2>
                </div>
                <p>Hello,</p>
                <p>Your password has been successfully reset.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <div class="footer">
                    &copy; CampusFlow Team
                </div>
            </div>
        </body>
        </html>
        """;
}
