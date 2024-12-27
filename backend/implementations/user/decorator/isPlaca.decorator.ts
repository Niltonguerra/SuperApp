import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPlaca(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPlaca',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // RegEx para validar o formato da placa (considerando o formato atual no Brasil)
          const placaRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
          return typeof value === 'string' && placaRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'A placa deve seguir o formato correto (ex: ABC1D23)';
        },
      },
    });
  };
}
