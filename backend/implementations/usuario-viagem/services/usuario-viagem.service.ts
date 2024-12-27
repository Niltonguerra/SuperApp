import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsuarioViagens } from '../entities/UsuarioViagens.entity';
import { UsuarioService } from 'implementations/user/services/user.service';
import { ViagemService } from 'src/modules/viagem/services/viagem.service';

@Injectable()
export class UsuarioViagemService {
  constructor(
    @InjectModel('usuario_viagens') private usuarioViagenstModel: Model<UsuarioViagens>,
    private usuarioService: UsuarioService,
    private viagemService: ViagemService,
  ) {}

  async associarUsuarioViagem(usuarioId: string, viagemId: string): Promise<UsuarioViagens> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioService.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se a viagem existe
    const viagem = await this.viagemService.findById(viagemId);
    if (!viagem) {
      throw new NotFoundException('Viagem não encontrada');
    }

    // Verificar se a associação já existe
    const existente = await this.usuarioViagenstModel.findOne({ usuario: usuarioId, viagem: viagemId });
    if (existente) {
      throw new Error('Associação já existe');
    }

    const novaAssociacao = new this.usuarioViagenstModel({ usuario: usuarioId, viagem: viagemId });
    return novaAssociacao.save();
  }

  async listarAssociacoes(): Promise<UsuarioViagens[]> {
    return this.usuarioViagenstModel.find().populate('usuario').populate('viagem').exec();
  }

  async removerAssociacao(id: string): Promise<void> {
    const associacao = await this.usuarioViagenstModel.findById(id);
    if (!associacao) {
      throw new NotFoundException('Associação não encontrada');
    }
    await this.usuarioViagenstModel.deleteOne({ _id: id });
  }
}
