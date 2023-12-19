import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderStatusStyle'
})
export class OrderStatusStylePipe implements PipeTransform {

    transform(status: string): string {
        switch (status) {
            case 'Completed':
                return ' bg-green-200 text-green-700';
            case 'Canceled':
                return ' bg-red-200 text-red-700';
            case 'Pending Payment':
                return ' bg-orange-200 text-orange-700';
            case 'Pending Pickup':
                return ' bg-blue-200 text-blue-700';
            default:
                return '';
        }
    }
}
