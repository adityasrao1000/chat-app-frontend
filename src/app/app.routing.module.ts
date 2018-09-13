import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChatRoomComponent } from './chatroom/chatroom.component';
import { GooglemapsComponent } from './maps/googlemaps.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chatroom/chat/aditya', pathMatch: 'full' },
  { path: 'map', component: GooglemapsComponent },
  { path: 'chatroom/:id/:name', component: ChatRoomComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
