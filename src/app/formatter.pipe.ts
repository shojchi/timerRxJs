import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatter',
  pure: true
})
export class FormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const hours = Math.floor((value / 60) / 60);
    const minutes = Math.floor(value / 60) % 60;
    const seconds = value % 60;
    return `${this.padding(hours)}${hours}:${this.padding(minutes)}${minutes}:${this.padding(seconds)}${seconds}`;
  }

  private padding(time: any): any {
    return time < 10 ? '0' : '';
  }
}
