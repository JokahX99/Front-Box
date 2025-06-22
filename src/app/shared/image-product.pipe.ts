import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.baseUrl;

@Pipe({
  name: 'imageProduct',
})
export class ImageProductPipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    if (value === null) {
      return 'assets/images/no-image.png';
    }

    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (typeof value === 'string') {
      return `${URL}/files/product/${value}`;
    }

    const image = value[0];

    if (!image) {
      return 'assets/images/no-image.png';
    }

    return `${URL}/files/product/${image}`;
  }
}
