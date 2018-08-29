import { Component, Inject, AfterViewInit, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent, Observable, of, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../models/message';

@Component({
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewInit {

    userList: string[] = [];
    messages: Message[] = [];
    msg: string;
    smily = '&#x1F642';
    online: Observable<boolean>;
    isonline: boolean;
    emojis = ['&#x1F911', '&#x1F642', '&#x1F600', '&#x1F601', '&#x1F602', '&#x1F603', '&#x1F604', '&#x1F605', '&#x1F606', '&#x1F607',
        '&#x1F608', '&#x1F609', '&#x1F60A', '&#x1F60B', '&#x1F60C', '&#x1F60D', '&#x1F60E', '&#x1F60F', '&#x1F610', '&#x1F611',
        '&#x1F612', '&#x1F613', '&#x1F614', '&#x1F615', '&#x1F616', '&#x1F617', '&#x1F618', '&#x1F619'];
    webSocket: WebSocket;
    retry = 1;
    chatroom: string;
    unread_msg_count: number;
    focus;
    username: string;
    constructor(@Inject(DOCUMENT) private document: any, private route: ActivatedRoute) {
        // initialize variables
        this.unread_msg_count = 0;
        this.msg = '';
    }

    ngOnInit(): void {
        merge(
            fromEvent(window, 'focus').pipe(mapTo(true))
        ).subscribe(() => {
            this.unread_msg_count = 0;
            this.document.title = 'chat';
        });

        /**
         * initialize variables with router path values
         */
        this.route.paramMap.subscribe(params => {
            this.chatroom = params.get('id');
            this.username = params.get('name');
        });

        this.online = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false))
        );

        /**
         * subscribe to the online observable
         * if online return true, reinitialize socket
         * else set isonline to false
         */
        this.online.subscribe(online => {
            if (online) {
                this.isonline = true;
                this.initializeSocket();
            } else {
                this.isonline = false;
            }
        });

    }

    /**
     * computes the date and time from a timestamp
     * @param date type string
     */
    toDate(date) {
        const d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    ngAfterViewInit() {
        /**
         * add change event listener to file input after its added to the markups
         */
        fromEvent(this.document.getElementById('file'), 'change')
            .subscribe(() => {
                if (this.document.getElementById('file').files[0]) {
                    if (this.document.getElementById('file').files[0].type.indexOf('image') > -1) {
                        if (this.document.getElementById('file').files[0].size <= 15728640) {
                            this.webSocket.send(this.document.getElementById('file').files[0]);
                            this.document.getElementById('file').value = '';
                        } else {
                            this.document.getElementById('file').value = '';
                            window.alert('file size too large');
                        }
                    } else {
                        this.document.getElementById('file').value = '';
                        alert('you can only share an image');
                    }
                }
            });
    }

    /**
     * wrapper function that manually clicks on the hidden file input field.
     */
    fileClick() {
        this.document.getElementById('file').click();
    }

    /**
     * appends an enoji to the message string
     * @param emoji
     */
    addEmoji(emoji) {
        this.msg += emoji;
    }

    /**
     * creates a new socket connection and adds event listeners to the socket
     */
    initializeSocket() {
        if ('WebSocket' in window) {
            console.log('initializing web socket');
            this.webSocket = new WebSocket(`ws://localhost:4567/${this.chatroom}?name=${this.username}`);

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
        if (message) {
            if (message !== '') {
                this.webSocket.send(message);
                this.msg = '';
            }
        }
    }

    /**
     * scrolls to the bottom of the chat box after image loads
     */
    imageLoad() {
        this.document.getElementById('scroll').scrollIntoView(true);
    }

    /**
     * if the current tab is in focus then set undread message count variable to 0
     * else increment the unread count anf update the document title with the count
     */
    tabInFocus() {
        if (this.document.hasFocus()) {
            this.unread_msg_count = 0;
            this.document.title = `chat`;
        } else {
            this.unread_msg_count++;
            this.document.title = `chat (${this.unread_msg_count})`;
        }
    }

    /**
     * Update the chat-panel, and the list of connected users when the socket receives
     *  a message from the server
     * @param msg
    */
    updateChat(msg) {
        // check if tab is currently in focus
        this.tabInFocus();
        const data = JSON.parse(msg.data);
        this.messages.push(data);
        this.userList = [];
        data.userlist.forEach((user) => {
            this.userList.push(user);
        });
        setTimeout(() => this.document.getElementById('scroll').scrollIntoView(true), 100);
    }
}
