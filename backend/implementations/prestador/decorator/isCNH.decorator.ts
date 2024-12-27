import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCnhConstraint implements ValidatorConstraintInterface {

  // Função que contém a lógica de validação da CNH
  validate(cnh: any, args: ValidationArguments) {
    if (typeof cnh !== 'string') {
      return false;
    }

    // Expressão regular para validar CNH (somente 11 dígitos)
    const cnhRegex = /^[0-9]{11}$/;

    return cnhRegex.test(cnh) && this.validateCnhDigits(cnh);
  }

  // Função para validar os dígitos verificadores da CNH
  validateCnhDigits(cnh: string) {
    const dsc = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
    let sum1 = 0;
    let sum2 = 0;

    // Verificando dígitos de controle (mais complexo)
    for (let i = 0; i < 9; i++) {
      sum1 += Number(cnh[i]) * (9 - i);
      sum2 += Number(cnh[i]) * dsc[i];
    }

    let mod1 = sum1 % 11;
    let mod2 = (sum2 + 2 * mod1) % 11;

    return (mod1 < 10 ? mod1 : 0) === Number(cnh[9]) && (mod2 < 10 ? mod2 : 0) === Number(cnh[10]);
  }

  // Mensagem padrão de erro (personalizável no decorator)
  defaultMessage(args: ValidationArguments) {
    return 'CNH ($value) inválida. Deve conter 11 dígitos e ser válida.';
  }
}

// Função decoradora para validar CNH
export function IsCnh(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnhConstraint,
    });
  };
}
