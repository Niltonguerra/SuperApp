import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuardPrestador implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const Prestador = request.Prestador;
    const { id } = request.params;

    if (Prestador.id !== id) {
      throw new ForbiddenException('Você não tem permissão para realizar essa ação');
    }

    return true;
  }
}
