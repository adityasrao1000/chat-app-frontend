import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeurl'
})
export class SafeURLPipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) { }

    public transform(value: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(value);
    }
}