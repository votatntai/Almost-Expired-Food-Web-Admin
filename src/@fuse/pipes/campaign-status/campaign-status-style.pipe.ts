import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'campaignStatusStyle'
})
export class CampaignStatusStylePipe implements PipeTransform {

    transform(status: string): string {
        switch (status) {
            case 'Opening':
                return 'bg-blue-200 text-blue-700';
            case 'Pending':
                return 'bg-orange-200 text-orange-700';
            case 'Cancel':
                return 'bg-red-200 text-red-700';
            case 'Completed':
                return 'bg-green-200 text-green-700';
            default:
                return '';
        }
    }
}
