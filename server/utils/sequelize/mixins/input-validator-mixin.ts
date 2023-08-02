export const InputValidatorMixin = (Base: any) =>
  class InputValidator extends Base {
    async checkInput(input: any) {
      if (!input) {
        return null;
      }
      const attributes = Object.keys(this.model.rawAttributes);
      const errors = [];
      for (let i = 0, len = attributes.length; i < len; i++) {
        const key = attributes[i];
        if (typeof input[key] === 'undefined') {
          continue;
        }
        const attribute = this.model.rawAttributes[key];
        if (!attribute.type.validate) {
          continue;
        }
        const value = input[key];
        if (attribute.allowNull && value === null) {
          continue;
        }
        try {
          await attribute.type.validate(value);
        } catch (error: any) {
          errors.push({
            message: error.message,
            type: error.name,
            attribute: key,
          });
        }
      }
      if (errors.length > 0) {
        console.log(errors);
        throw new Error('Invalid input value');
      }
      return null;
    }
  };
