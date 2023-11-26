import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk',
})
export class ChunkPipe implements PipeTransform {
  transform(value: any[], size: number): any[] {
    if (!value) return [];
    return Array.from({ length: Math.ceil(value.length / size) }, (v, i) =>
      value.slice(i * size, i * size + size)
    );
  }
}

