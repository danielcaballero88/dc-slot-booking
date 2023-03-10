import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  BookSlotResponse,
  GetWeekResponse,
  SlotObj,
  WeekDatesSlots,
} from 'src/app/models/shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlotBookingService {
  constructor(private http: HttpClient) {}

  getWeek(offset: number): Observable<WeekDatesSlots> {
    const queryParams = new HttpParams().set('offset', offset);
    return this.http
      .get<GetWeekResponse>(environment.apiUrl + '/booking/get_week', {
        params: queryParams,
      })
      .pipe(
        map((resp: GetWeekResponse) => {
          const parsedResp: WeekDatesSlots = {};
          for (let date in resp) {
            const slotStatuses = resp[date];
            parsedResp[date] = {};
            for (let slotId in slotStatuses) {
              const slotStatus = slotStatuses[slotId];
              const slotObj: SlotObj = {
                date: date,
                id: Number(slotId),
                status: slotStatus,
              };
              parsedResp[date][slotId] = slotObj;
            }
          }
          return parsedResp;
        }),
      );
  }

  bookSlot(date: string, slotId: number): Observable<BookSlotResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      date_str: date,
      slot_id: slotId,
    };
    const bodyStr = JSON.stringify(body);

    return this.http.post<BookSlotResponse>(
      environment.apiUrl + '/booking/book_slot',
      bodyStr,
      {
        headers: headers,
      },
    );
  }

  unbookSlot(date: string, slotId: number): Observable<BookSlotResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      date_str: date,
      slot_id: slotId,
    };
    const bodyStr = JSON.stringify(body);

    return this.http.delete<BookSlotResponse>(
      environment.apiUrl + '/booking/unbook_slot',
      {
        body: bodyStr,
        headers: headers,
      },
    );
  }
}
