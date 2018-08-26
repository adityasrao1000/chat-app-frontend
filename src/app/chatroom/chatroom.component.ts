import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent, Observable, of, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.scss']
})
export class ChatRoomComponent {

    userList: string[] = [];
    messages: string[] = [];
    msg = '';
    smily = '&#x1F642';
    online: Observable<boolean>;
    isonline: boolean;
    emojis = ['&#x1F911'];
    // Establish the WebSocket connection and set up event handlers
    webSocket: WebSocket;
    retry = 1;
    chatroom: string;
    constructor(@Inject(DOCUMENT) private document: any, private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.chatroom = params['id'];
        });

        this.online = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false))
        );
        this.online.subscribe(online => {
            if (online) {
                this.isonline = true;
                this.initializeSocket();
            } else {
                this.isonline = false;
            }
        });
    }

    initializeSocket(): any {
        console.log('initializing web socket');
        this.webSocket = new WebSocket(`ws://localhost:4567/${this.chatroom}`);
        fromEvent(this.webSocket, 'message')
            .subscribe(msg => this.updateChat(msg));

        fromEvent(this.webSocket, 'close')
            .subscribe(() => {
                if (this.isonline) {
                    if (this.retry <= 3) {
                        console.log('trying to reconnect, attempt: ' + this.retry);
                        this.retry++;
                        this.initializeSocket();
                    }
                }
            });
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
