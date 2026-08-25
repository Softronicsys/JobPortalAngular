import { Injectable } from '@angular/core';

@Injectable()
export class ImageCompressService {
  // Compatibility shim for legacy ngx-image-compress usage.
  compressFile(image: string, _orientation: number, _ratio: number, _quality: number): Promise<string> {
    return Promise.resolve(image);
  }

  byteCount(image: string): number {
    if (!image) {
      return 0;
    }
    const base64 = image.includes(',') ? image.split(',')[1] : image;
    return Math.ceil((base64.length * 3) / 4);
  }
}
