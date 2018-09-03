import { Injectable } from '@angular/core';

@Injectable()
export class EmojiService {
    private readonly emojis = ['&#x1F911', '&#x1F642', '&#x1F600', '&#x1F601', '&#x1F602', '&#x1F603', '&#x1F604', '&#x1F605', '&#x1F606',
        '&#x1F607', '&#x1F608', '&#x1F609', '&#x1F60A', '&#x1F60B', '&#x1F60C', '&#x1F60D', '&#x1F60E', '&#x1F60F', '&#x1F610', '&#x1F611',
        '&#x1F612', '&#x1F613', '&#x1F614', '&#x1F615', '&#x1F616', '&#x1F617', '&#x1F618', '&#x1F619'];

    getEmojis(): Array<string> {
        return this.emojis;
    }
}
