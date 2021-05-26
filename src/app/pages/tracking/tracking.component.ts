import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { MapService } from 'src/app/services/map.service';
import { Location } from 'src/app/shared/models/location';

declare const google;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent implements OnInit, OnDestroy {
  private startLocation: Location;
  private endLocation: Location;
  private vehicleMarker: any;
  private map: any;
  private coordinateRefreshInterval: any;
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();
  constructor(
    private mapService: MapService,
    private httpService: HttpService
  ) {
    this.startLocation = {
      lat: 29.528894,
      lng: 75.036915,
    } as Location;
    this.endLocation = {
      lat: 29.530676,
      lng: 75.03656,
    } as Location;
  }

  ngOnInit(): void {
    this.loadMap();
  }

  /**
   * Loads the map
   */
  loadMap() {
    /**
     * Uncomment line below to get user's current location
     */
    // this.startLocation = await this.mapService.getCurrentPosition();
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: this.startLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    this.setMarker();
    this.createRoute();
    this.getRouteCoordinates();
  }

  /**
   * Set the vehicle marker
   */
  setMarker() {
    this.vehicleMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.startLocation,
      icon: 'assets/images/car.png',
    });
    this.vehicleMarker.setMap(this.map);
  }

  /**
   * Create route between coordinates/locations
   */
  createRoute() {
    let distance: number = 0;
    const request = {
      origin: new google.maps.LatLng(
        this.startLocation.lat,
        this.startLocation.lng
      ),
      destination: new google.maps.LatLng(
        this.endLocation.lat,
        this.endLocation.lng
      ),
      travelMode: google.maps.TravelMode.DRIVING,
    };
    this.directionsService.route(request, (response, status) => {
      if (
        status == google.maps.DirectionsStatus.OK &&
        response.routes.length != 0
      ) {
        distance = parseFloat(
          (response.routes[0].legs[0].distance.value / 1000).toFixed(2)
        );
        this.directionsRenderer.setDirections(response);
        this.directionsRenderer.setMap(this.map);
        console.log(`Distance:: ${distance} KM`); // Distance between route locations
      } else {
        console.log('Unable to show directions on map!!');
      }
    });
  }

  /**
   * Get coordinates on the route from Google API
   */
  getRouteCoordinates() {
    let routePoints: Array<any> = [];
    this.httpService
      .googleRoadApi(this.startLocation, this.endLocation)
      .subscribe((response) => {
        if (response.snappedPoints && response.snappedPoints.length > 0) {
          routePoints = response.snappedPoints;
          this.moveCar(routePoints);
        }
      });
  }

  /**
   * Move marker on to the route
   * @param routePoints Coordinates between the route
   */
  moveCar(routePoints: Array<any>) {
    let coordinateIndex = 0;
    this.coordinateRefreshInterval = setInterval(() => {
      this.vehicleMarker.setPosition(
        new google.maps.LatLng(
          routePoints[coordinateIndex].location.latitude,
          routePoints[coordinateIndex].location.longitude
        )
      );
      this.map.panTo(
        new google.maps.LatLng(
          routePoints[coordinateIndex].location.latitude,
          routePoints[coordinateIndex].location.longitude
        )
      );
      coordinateIndex = coordinateIndex + 1;
      if (coordinateIndex === routePoints.length) {
        clearInterval(this.coordinateRefreshInterval);
        this.moveCar(routePoints);
      }
    }, 2000);
  }

  ngOnDestroy() {
    if (this.coordinateRefreshInterval)
      clearInterval(this.coordinateRefreshInterval);
  }
}
