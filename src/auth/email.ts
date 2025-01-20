import {
  GetPasswordResetEmailContentFn,
  GetVerificationEmailContentFn,
} from 'wasp/server/auth'

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({
  verificationLink,
}) => ({
  subject: 'Welcome to steg - Verify Your Email',
  text: `Welcome to steg! Please verify your email by clicking this link: ${verificationLink}`,
  html: `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #ffffff; width: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="width: 100%; background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">
                <tr>
                  <td style="padding-bottom: 40px;">
                    <h1 style="color: #000000; font-family: Inter, Arial, sans-serif; font-size: 48px; margin: 0; font-weight: 500;">steg</h1>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="padding: 24px; border: 1px solid #e5e5e5;">
                    <p style="color: #000000; font-family: Inter, Arial, sans-serif; font-size: 16px; margin: 0 0 24px 0; line-height: 1.5;">
                      Thanks for signing up! Please verify your email address to start tracking your progress.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="#000000" style="border: 1px solid #000000;">
                          <a href="${verificationLink}"
                             style="display: inline-block; padding: 12px 24px; color: #ffffff; font-family: Inter, Arial, sans-serif; font-size: 16px; text-decoration: none;">
                            verify email
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #666666; font-family: Inter, Arial, sans-serif; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">
                      If you didn't create an account with steg, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="color: #666666; font-family: Inter, Arial, sans-serif; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} getsteg.app
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
})

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({
  passwordResetLink,
}) => ({
  subject: 'Reset Your steg Password',
  text: `Reset your steg password by clicking this link: ${passwordResetLink}`,
  html: `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #ffffff; width: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="width: 100%; background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">
                <tr>
                  <td style="padding-bottom: 40px;">
                    <h1 style="color: #000000; font-family: Inter, Arial, sans-serif; font-size: 48px; margin: 0; font-weight: 500;">steg</h1>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#fafafa" style="padding: 24px; border: 1px solid #e5e5e5;">
                    <p style="color: #000000; font-family: Inter, Arial, sans-serif; font-size: 16px; margin: 0 0 24px 0; line-height: 1.5;">
                      We received a request to reset your password. Click the button below to choose a new one.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="#000000" style="border: 1px solid #000000;">
                          <a href="${passwordResetLink}"
                             style="display: inline-block; padding: 12px 24px; color: #ffffff; font-family: Inter, Arial, sans-serif; font-size: 16px; text-decoration: none;">
                            reset password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #666666; font-family: Inter, Arial, sans-serif; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="color: #666666; font-family: Inter, Arial, sans-serif; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} getsteg.app
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
})
