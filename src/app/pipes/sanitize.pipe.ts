import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author Aditya
 */
@Pipe({
    name: 'sanitize'
})
export class SanitizeHtmlPipe implements PipeTransform {

    /**
     * strips the h1, h2, h3, h4, h5, h6 markup tags from the string
     * @param str
     */
    transform(str) {
        return str.replace(/<h[1-6]\/?>/i, '');
    }
}
