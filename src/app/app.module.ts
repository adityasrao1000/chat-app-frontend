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
import { GooglemapsComponent } from './maps/googlemaps.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    SanitizeHtmlPipe,
    SafeURLPipe,
    EmojisComponent,
    GooglemapsComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA7VDW33OiBooHoEpzCYYc2iDb7wTKf1U8'
    }),
    AppRoutingModule,
    FormsModule
  ],
  providers: [EmojiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
