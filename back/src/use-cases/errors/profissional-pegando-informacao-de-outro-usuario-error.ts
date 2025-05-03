export class ProfissionalTentandoPegarInformacoesDeOutro extends Error {
  constructor() {
    super('Você não pode pegar informações de outro profissional');
    this.name = 'ProfissionalTentandoPegarInformacoesDeOutro';
  }
}
