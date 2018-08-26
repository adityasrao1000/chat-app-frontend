import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SanitizeHtmlPipe } from './pipes/sanitize.pipe';
import { ChatRoomComponent } from './chatroom/chatroom.component';
import { AppRoutingModule } from './app.routing.module';
import { SafeURLPipe } from './pipes/safeurl.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    SanitizeHtmlPipe,
    SafeURLPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
