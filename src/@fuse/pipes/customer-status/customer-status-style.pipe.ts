import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customerStatusStyle'
})
export class CustomerStatusStylePipe implements PipeTransform {

    transform(status: string): string {
        switch (status) {
            case 'Active':
                return ' bg-green-200 text-green-700';
            case 'Locked':
                return ' bg-red-200 text-red-700';
            default:
                return '';
        }
    }
}
