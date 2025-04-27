import sgMail, { MailDataRequired } from '@sendgrid/mail';

export class EmailService {
  private readonly sender: string;
  private readonly appUrl: string;

  constructor() {
    if (
      !process.env.SENDGRID_API_KEY ||
      !process.env.EMAIL_FROM ||
      !process.env.APP_URL
    ) {
      throw new Error(
        'Variáveis de ambiente SENDGRID_API_KEY, EMAIL_FROM ou APP_URL não definidas.',
      );
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.sender = process.env.EMAIL_FROM;
    this.appUrl = process.env.APP_URL;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const subject = 'Verifique seu e-mail';
    const html = `<p>Clique <a href="${this.appUrl}/users/verify-email?token=${token}">aqui</a> para verificar seu e-mail</p>`;
    await this.sendEmail(email, subject, html, 'verificação de e-mail');
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const subject = 'Redefinição de senha';
    const html = `
      <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
      <p><a href="${this.appUrl}/users/reset-password?token=${token}">Redefinir senha</a></p>
      <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
      <p>O link expirará em 2 horas.</p>
    `;
    await this.sendEmail(email, subject, html, 'redefinição de senha');
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    context: string,
  ): Promise<void> {
    const msg: MailDataRequired = {
      to,
      from: this.sender,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(`Erro ao enviar e-mail de ${context}:`, {
        error,
        to,
        subject,
      });
      throw new Error(`Falha ao enviar e-mail de ${context}`);
    }
  }
}
