export class UsuarioTentandoPegarInformacoesDeOutro extends Error {
  constructor() {
    super('Você não pode pegar/editar informações de outro usuário');
    this.name = 'UsuaruioTentandoPegarInformacoesDeOutro';
  }
}
