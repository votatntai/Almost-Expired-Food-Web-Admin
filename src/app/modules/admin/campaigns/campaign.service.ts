import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Campaign } from 'app/types/campaign.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignService {

    private baseUrl = environment.baseUrl;

    private _campaign: BehaviorSubject<Campaign | null> = new BehaviorSubject(null);
    private _campaigns: BehaviorSubject<Campaign[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for campaign
 */
    get campaign$(): Observable<Campaign> {
        return this._campaign.asObservable();
    }

    /**
     * Getter for campaigns
     */
    get campaigns$(): Observable<Campaign[]> {
        return this._campaigns.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get campaigns
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getCampaigns(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Campaign[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Campaign[] }>(this.baseUrl + '/api/campaigns', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._campaigns.next(response.data);
            }),
        );
    }

    /**
* Create campaign
*/
    createCampaign(data) {
        return this.campaigns$.pipe(
            take(1),
            switchMap((campaigns) => this._httpClient.post<Campaign>(this.baseUrl + '/api/campaigns', data).pipe(
                map((newCampaign) => {

                    // Update campaign list with current page size
                    this._campaigns.next([newCampaign, ...campaigns].slice(0, this._pagination.value.pageSize));

                    return newCampaign;
                })
            ))
        )
    }

    /**
* Get campaign by id
*/
    getCampaign(id: string) {
        return this._httpClient.get<Campaign>(this.baseUrl + '/api/campaigns/' + id).pipe(tap((response) => {
            this._campaign.next(response);
        }))
    }

    /**
    * Update campaign
    */
    updateCampaign(id: string, data) {
        return this.campaigns$.pipe(
            take(1),
            switchMap((campaigns) => this._httpClient.put<Campaign>(this.baseUrl + '/api/campaigns/' + id, data).pipe(
                map((updatedCampaign) => {

                    // Find and replace updated campaign
                    const index = campaigns.findIndex(item => item.id === id);
                    campaigns[index] = updatedCampaign;
                    this._campaigns.next(campaigns);

                    // Update campaign
                    this._campaign.next(updatedCampaign);

                    return updatedCampaign;
                })
            ))
        )
    }

    /**
* Approve campaign
*/
    lockCampaign(id: string) {
        return this.campaigns$.pipe(
            take(1),
            switchMap((campaigns) => this._httpClient.put<Campaign>(this.baseUrl + '/api/campaigns/' + id, { status: 'Locked' }).pipe(
                map((updatedCampaign) => {

                    // Find and replace updated campaign
                    const index = campaigns.findIndex(item => item.id === id);
                    campaigns[index] = updatedCampaign;
                    this._campaigns.next(campaigns);

                    // Update campaign
                    this._campaign.next(updatedCampaign);

                    return updatedCampaign;
                })
            ))
        )
    }

    /**
* Reject campaign
*/
    unlockCampaign(id: string) {
        return this.campaigns$.pipe(
            take(1),
            switchMap((campaigns) => this._httpClient.put<Campaign>(this.baseUrl + '/api/campaigns/' + id, { status: 'Active' }).pipe(
                map((updatedCampaign) => {

                    // Find and replace updated campaign
                    const index = campaigns.findIndex(item => item.id === id);
                    campaigns[index] = updatedCampaign;
                    this._campaigns.next(campaigns);

                    // Update campaign
                    this._campaign.next(updatedCampaign);

                    return updatedCampaign;
                })
            ))
        )
    }
}