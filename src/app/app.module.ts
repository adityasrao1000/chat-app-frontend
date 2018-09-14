import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SanitizeHtmlPipe } from './pipes/sanitize.pipe';
import { ChatRoomComponent } from './chatroom/chatroom.component';
import { AppRoutingModule } from './app.routing.module';
import { SafeURLPipe } from './pipes/safeurl.pipe';
import { EmojiService } from './services/emoji.service';
import { EmojisComponent } from './emojis/emojis.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    SanitizeHtmlPipe,
    SafeURLPipe,
    EmojisComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [EmojiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
