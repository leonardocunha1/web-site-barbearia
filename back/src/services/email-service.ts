import sgMail, { MailDataRequired } from '@sendgrid/mail';
import {
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS,
  PASSWORD_RESET_TOKEN_EXPIRATION_HOURS,
} from '@/consts/const';
import tracer from '@/observability/tracer';
import logger from '@/observability/logger';

export class EmailService {
  private readonly sender: string;
  private readonly appUrl: string;

  constructor() {
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM || !process.env.APP_URL) {
      throw new Error(
        'Variáveis de ambiente SENDGRID_API_KEY, EMAIL_FROM ou APP_URL não definidas.',
      );
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.sender = process.env.EMAIL_FROM;
    this.appUrl = process.env.APP_URL;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    return tracer.trace('email.send.verification', async (span) => {
      span.setTag('email.to', email);
      span.setTag('email.type', 'verification');
      span.setTag('email.provider', 'sendgrid');

      const subject = 'Verifique seu e-mail';
      const html = `
      <p>Clique <a href="${this.appUrl}/users/verify-email?token=${token}">aqui</a> para verificar seu e-mail.</p>
      <p>Este link expira em ${EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS} horas.</p>
    `;
      await this.sendEmail(email, subject, html, 'verificação de e-mail', span);
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    return tracer.trace('email.send.password_reset', async (span) => {
      span.setTag('email.to', email);
      span.setTag('email.type', 'password_reset');
      span.setTag('email.provider', 'sendgrid');

      const subject = 'Redefinição de senha';
      const html = `
      <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
      <p><a href="${this.appUrl}/users/reset-password?token=${token}">Redefinir senha</a></p>
      <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
      <p>O link expirará em ${PASSWORD_RESET_TOKEN_EXPIRATION_HOURS} horas.</p>
    `;
      await this.sendEmail(email, subject, html, 'redefinição de senha', span);
    });
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    context: string,
    parentSpan?: any,
  ): Promise<void> {
    const msg: MailDataRequired = {
      to,
      from: this.sender,
      subject,
      html,
    };

    const startTime = Date.now();

    try {
      await sgMail.send(msg);

      const duration = Date.now() - startTime;

      if (parentSpan) {
        parentSpan.setTag('email.sent', 'true');
        parentSpan.setTag('email.duration_ms', duration);
      }

      tracer.dogstatsd.increment('email.sent', 1, {
        type: context.replace(/ /g, '_'),
        status: 'success',
        provider: 'sendgrid',
      });

      tracer.dogstatsd.histogram('email.send_duration', duration, {
        type: context.replace(/ /g, '_'),
      });

      logger.info('Email sent successfully', {
        to,
        subject,
        context,
        durationMs: duration,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';

      if (parentSpan) {
        parentSpan.setTag('error', true);
        parentSpan.setTag('error.type', errorType);
        parentSpan.setTag('email.sent', 'false');
      }

      tracer.dogstatsd.increment('email.sent', 1, {
        type: context.replace(/ /g, '_'),
        status: 'error',
        provider: 'sendgrid',
        error_type: errorType,
      });

      logger.error('Email sending failed', {
        to,
        subject,
        context,
        error: errorMessage,
        errorType,
      });

      console.error(`Erro ao enviar e-mail de ${context}:`, {
        error,
        to,
        subject,
      });
      throw new Error(`Falha ao enviar e-mail de ${context}`);
    }
  }
}
