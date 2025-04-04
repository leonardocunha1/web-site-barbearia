import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM!,
      subject: 'Verifique seu e-mail',
      html: `<p>Clique <a href="${verificationLink}">aqui</a> para verificar seu e-mail</p>`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('SendGrid error:', error);
      throw new Error('Falha ao enviar e-mail de verificação');
    }
  }
}
