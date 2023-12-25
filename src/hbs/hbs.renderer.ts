/* eslint-disable prefer-rest-params */
/* eslint-disable no-invalid-this */
import { Injectable } from '@nestjs/common';
import hbs from 'hbs';
import path from 'path';

@Injectable()
export class HbsRenderer {
  constructor() {
    hbs.registerHelper(
      'add',
      (value1: number, value2: number) => value1 + value2,
    );

    hbs.registerHelper('ifExist', function (value, options) {
      if (value !== undefined && value !== null) {
        return options.fn(this);
      }

      return options.inverse(this);
    });

    hbs.registerHelper('ifAllExist', function () {
      const values = Array.prototype.slice.call(arguments, 0, -1);
      const options = arguments[arguments.length - 1];

      for (const value of values) {
        if (value === undefined || value === null) {
          return options.inverse(this);
        }
      }

      return options.fn(this);
    });

    hbs.registerPartials(path.join(__dirname, '../..', 'views', 'partials'));
  }
}
