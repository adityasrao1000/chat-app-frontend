import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
    @Input() users: string[] = [];
    lat = 41.40338;
    lng = 2.17403;
}
