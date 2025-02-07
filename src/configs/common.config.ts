import { registerAs } from '@nestjs/config';

const NODE_ENVIRONMENTS = ['development', 'staging', 'beta', 'production'];

export default registerAs('common', () => ({
  port: process.env.APP_PORT || 3000,
  appName: process.env.APP_NAME,
  appHostName: process.env.APP_HOSTNAME,
  nodeEnv: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === NODE_ENVIRONMENTS[0],
  swaggerApiRoot: process.env.SWAGGER_API_ROOT,
  emailVerificationOtpValidityInMinutes: process.env.EMAIL_VERIFICATION_OTP_VALIDITY_IN_MINUTES,
  defaultEmailProvider: process.env.DEFAULT_EMAIL_PROVIDER,
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    senderName: process.env.SENDGRID_SENDER_NAME,
    senderEmail: process.env.SENDGRID_SENDER_EMAIL,
    templates: {
      emailVerification: process.env.SENDGRID_TEMPLATES_EMAIL_VERIFICATION,
      welcome: process.env.SENDGRID_TEMPLATES_USER_WELCOME,
      passwordResetOtp: process.env.SENDGRID_TEMPLATES_RESET_PASSWORD_OTP,
      passwordReset: process.env.SENDGRID_TEMPLATES_NEW_PASSWORD_DEFAULT,
    },
  },
  auth: {
    authName: process.env.AUTH_NAME,
    serviceKey: process.env.APP_SERVICE_KEY,
  },
}));
