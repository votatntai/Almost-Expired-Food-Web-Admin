import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productStatusStyle'
})
export class ProductStatusStylePipe implements PipeTransform {

    transform(status: string): string {
        switch (status) {
            case 'Available':
                return ' bg-green-200 text-green-700';
            case 'Out Of Stock':
                return ' bg-red-200 text-red-700';
            default:
                return '';
        }
    }
}
