import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-maps',
    templateUrl: './googlemaps.component.html',
    styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent {
    @Input() users: string[] = [];
    lat = 41.40338;
    lng = 2.17403;
}
