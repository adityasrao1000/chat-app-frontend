import { Component, Output, EventEmitter } from '@angular/core';
import { EmojiService } from '../services/emoji.service';

@Component({
    selector: 'app-emojis',
    templateUrl: './emojis.component.html',
    styleUrls: ['./emojis.component.scss']
})
export class EmojisComponent {
    @Output() emoji = new EventEmitter();
    emojis: string[] = [];

    constructor(private emojiservice: EmojiService) {
        this.emojis = this.emojiservice.getEmojis();
    }

    addEmoji(e: string) {
      this.emoji.emit(e);
    }
}
