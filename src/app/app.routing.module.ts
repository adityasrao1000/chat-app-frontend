import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChatRoomComponent } from './chatroom/chatroom.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chatroom/chat', pathMatch: 'full' },
  { path: 'chatroom/:id', component: ChatRoomComponent }
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
