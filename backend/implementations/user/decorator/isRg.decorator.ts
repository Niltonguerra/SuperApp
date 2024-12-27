import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsRgConstraint implements ValidatorConstraintInterface {

  // Função que contém a lógica de validação do RG
  validate(rg: any, args: ValidationArguments) {
    if (typeof rg !== 'string') {
      return false;
    }

    // Expressão regular para validar RG (somente números ou com . e -)
    const rgRegex = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9Xx]{1}$/;

    return rgRegex.test(rg);
  }

  // Mensagem padrão de erro (personalizável no decorator)
  defaultMessage(args: ValidationArguments) {
    return 'RG ($value) inválido. Deve estar no formato 00.000.000-X';
  }
}

// Função decoradora para validar RG
export function IsRg(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRgConstraint,
    });
  };
}
