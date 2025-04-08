export class MockEmailService {
  async sendVerificationEmail(email: string): Promise<void> {
    console.log(`Email de verificação enviado para ${email}`);
    return Promise.resolve();
  }
}
