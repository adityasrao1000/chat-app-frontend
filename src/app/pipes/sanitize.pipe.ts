import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

@Pipe({
    name: 'sanitize'
})
export class SanitizeHtmlPipe implements PipeTransform {

    constructor() { }

    transform(str) {
        // remove h1, h2, h3, h4, h5, h6 tags
        return str.replace(/<h[1-6]\/?>/i, '');
    }
}
