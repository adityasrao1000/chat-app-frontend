import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-maps',
    templateUrl: './googlemaps.component.html',
    styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent {
    lat = 41.40338;
    lng = 2.17403;
}
