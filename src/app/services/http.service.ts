import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GOOGLE_API_KEY } from 'src/environments/environment.prod';
import { Location } from '../shared/models/location';
export * from 'rxjs-compat';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(public http: HttpClient) {}

  /**
   * Google Road API
   * @param pickup Point A coordinates
   * @param destination Point B coordinates
   * @returns List of latitudes and longitudes between the coordinates A and B
   */
  googleRoadApi(pickup: Location, destination: Location): Observable<any> {
    return this.http
      .get(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pickup.lat},${pickup.lng}|${destination.lat},${destination.lng}&interpolate=true&key=${GOOGLE_API_KEY}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Error Handler
   * @param error Error
   * @returns
   */
  private handleError(error: HttpErrorResponse): Promise<any> {
    return Promise.reject(error.error);
  }
}
