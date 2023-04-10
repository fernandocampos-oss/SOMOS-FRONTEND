import { DateFormat } from '@data/enums/date-format.enum';
import * as moment from 'moment';

export class DateUtil {
  static parseAge(
    birthdate: string,
    format: DateFormat = DateFormat.DD_MM_YYYY
  ) {
    let age: number;
    if (birthdate) {
      const date = moment(birthdate, format).toDate();
      age = this.toAge(date);
    }
    return age;
  }
  static toAge(date: Date) {
    let age: number;
    if (date) {
      const timeDiff = Math.abs(Date.now() - date.getTime());
      age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    }
    return age;
  }
}
