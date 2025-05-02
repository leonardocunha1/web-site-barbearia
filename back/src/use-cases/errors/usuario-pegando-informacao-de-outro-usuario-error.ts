export class UsuaruioTentandoPegarInformacoesDeOutro extends Error {
  constructor() {
    super('Você não pode pegar informações de outro usuário');
    this.name = 'UsuaruioTentandoPegarInformacoesDeOutro';
  }
}
