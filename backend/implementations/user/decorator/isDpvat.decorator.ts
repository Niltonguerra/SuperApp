import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Validação principal
@ValidatorConstraint({ async: false })
export class IsDpvatConstraint implements ValidatorConstraintInterface {
  validate(dpvat: any) {
    // Checa se o número do DPVAT tem 11 dígitos e é numérico
    const dpvatRegex = /^\d{11}$/;
    return typeof dpvat === 'string' && dpvatRegex.test(dpvat);
  }

  defaultMessage() {
    return 'O número do DPVAT deve ser uma string de 11 dígitos.';
  }
}

// Decorator para ser usado nos DTOs
export function IsDpvat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDpvatConstraint,
    });
  };
}
