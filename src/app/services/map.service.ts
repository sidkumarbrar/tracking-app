import { Injectable } from '@angular/core';
import { Location } from '../shared/models/location';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  /**
   * Get current location
   * @returns Current location latitude and longitude
   */
  getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
}
