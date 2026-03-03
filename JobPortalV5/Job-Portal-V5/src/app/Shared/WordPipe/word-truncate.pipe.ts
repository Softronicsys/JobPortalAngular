import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordTruncate'
})
export class WordTruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 15): string {
    if (!value) return '';

    const words = value.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return value;
    }
  }
}
