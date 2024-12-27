import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Validação principal
@ValidatorConstraint({ async: false })
export class IsCrlvConstraint implements ValidatorConstraintInterface {
  validate(crlv: any) {
    // Checa se o número do CRLV tem 11 dígitos e é numérico
    const crlvRegex = /^\d{11}$/;
    return typeof crlv === 'string' && crlvRegex.test(crlv);
  }

  defaultMessage() {
    return 'O número do CRLV deve ser uma string de 11 dígitos.';
  }
}

// Decorator para ser usado nos DTOs
export function IsCrlv(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCrlvConstraint,
    });
  };
}
