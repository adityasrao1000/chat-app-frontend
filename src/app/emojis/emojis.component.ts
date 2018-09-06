import { Component } from '@angular/core';
import { EmojiService } from '../services/emoji.service';

@Component({
    selector: 'app-emojis',
    templateUrl: './emojis.component.html',
    styleUrls: ['./emojis.component.scss']
})
export class EmojisComponent {
    emojis: string[] = [];

    constructor(private emoji: EmojiService) {
        this.emojis = this.emoji.getEmojis();
    }
}
