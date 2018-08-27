import { Component, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent, Observable, of, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.scss']
})
export class ChatRoomComponent implements AfterViewInit {

    userList: string[] = [];
    messages: string[] = [];
    msg: string;
    smily = '&#x1F642';
    online: Observable<boolean>;
    isonline: boolean;
    emojis = ['&#x1F911'];
    webSocket: WebSocket;
    retry = 1;
    chatroom: string;

    constructor(@Inject(DOCUMENT) private document: any, private route: ActivatedRoute) {

        this.msg = '';
        this.route.paramMap.subscribe(params => {
            this.chatroom = params.get('id');
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

    ngAfterViewInit() {
        /**
         * add change event listener to file input after its added to the markups
         */
        fromEvent(this.document.getElementById('file'), 'change')
            .subscribe(() => {
                this.webSocket.send(this.document.getElementById('file').files[0]);
            });
    }

    /**
     * wrapper function that manually clicks on the hidden file input field.
     */
    fileClick() {
        this.document.getElementById('file').click();
    }

    /**
     * creates a new socket connection and adds event listeners to the socket
     */
    initializeSocket() {
        if ('WebSocket' in window) {
            console.log('initializing web socket');
            this.webSocket = new WebSocket(`ws://localhost:4567/${this.chatroom}`);

            /**
             * event listener fires when the socket recieves a message from the server
             */
            fromEvent(this.webSocket, 'message')
                .subscribe(msg => this.updateChat(msg));

            /**
             * event listener fires when the socket connection is closed
             */
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
        } else {
            window.alert('your browser does not support web sockets');
        }
    }

    /**
     *  wrapper function
     */
    send() {
        this.sendMessage(this.msg);
    }

    /**
     * Send a message if it's not empty, then clear the input field
     * @param message
     */
    sendMessage(message) {
        if (message !== '') {
            this.webSocket.send(message);
            this.msg = '';
        }
    }

    /**
     * scrolls to the bottom of the chat box after image loads
     */
    imageLoad() {
        this.document.getElementById('scroll').scrollIntoView(true);
    }

    /**
     * Update the chat-panel, and the list of connected users when the socket receives
     *  a message from the server
     * @param msg
    */
    updateChat(msg) {
        if (msg.data instanceof Blob) {
            this.messages.push(window.URL.createObjectURL(msg.data));
            return;
        }
        const data = JSON.parse(msg.data);
        this.messages.push(data);
        this.userList = [];
        data.userlist.forEach((user) => {
            this.userList.push(user);
        });
        setTimeout(() => this.document.getElementById('scroll').scrollIntoView(true), 100);
    }
}
