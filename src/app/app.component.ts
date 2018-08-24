import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userList: string[] = [];
  messages: string[] = [];
  msg = '';
  smily = '&#x1F642';
  // Establish the WebSocket connection and set up event handlers
  readonly webSocket = new WebSocket('ws://localhost:4567/chat');

  constructor(@Inject(DOCUMENT) private document: any) {
    fromEvent(this.webSocket, 'message')
      .subscribe(msg => this.updateChat(msg));

    fromEvent(this.webSocket, 'close')
      .subscribe(() => alert('WebSocket connection closed'));
  }

  send() {
    this.sendMessage(this.msg);
  }

  message(e) {
    this.sendMessage(this.msg);
  }

  // Send a message if it's not empty, then clear the input field
  sendMessage(message) {
    if (message !== '') {
      this.webSocket.send(message);
      this.msg = '';
    }
  }

  // Update the chat-panel, and the list of connected users
  updateChat(msg) {
    const data = JSON.parse(msg.data);
    this.messages.push(data);
    this.userList = [];
    data.userlist.forEach((user) => {
      this.userList.push(user);
    });
    setTimeout(() => this.document.getElementById('scroll').scrollIntoView(true), 100);
  }
}
