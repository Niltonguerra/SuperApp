import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHistoricoDto } from '../dtos/CriarHistorico.dto';
import { UpdateHistoricoDto } from '../dtos/AtualizarHistorico.dto';
import { Historico } from '../entities/historico.entity';

@Injectable()
export class HistoricoService {
  constructor(
    @InjectModel('historico') private historicoModel: Model<Historico>,
  ) {}

  async create(createHistoricoDto: CreateHistoricoDto): Promise<Historico> {
    const newHistorico = new this.historicoModel(createHistoricoDto);
    return newHistorico.save();
  }

  async findAll(): Promise<Historico[]> {
    return this.historicoModel.find().exec();
  }

  async findOne(id: string): Promise<Historico> {
    const historico = await this.historicoModel.findById(id).exec();
    if (!historico) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return historico;
  }

  
  async findByIds(ids: string[]): Promise<Historico[]> {
    return this.historicoModel.find({ _id: { $in: ids } }).exec();
  }

  async update(id: string, updateHistoricoDto: UpdateHistoricoDto): Promise<Historico> {
    const updatedHistorico = await this.historicoModel
      .findByIdAndUpdate(id, updateHistoricoDto, { new: true })
      .exec();
    if (!updatedHistorico) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return updatedHistorico;
  }

  async remove(id: string): Promise<void> {
    const result = await this.historicoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
  }
}
