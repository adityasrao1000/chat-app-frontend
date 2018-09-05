import { Component, Inject, AfterViewInit, OnInit } from '@angular/core';
import { fromEvent, Observable, of, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../models/message';
import { DOCUMENT } from '@angular/common';
import { EmojiService } from '../services/emoji.service';

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
    emojis: string[];
    webSocket: WebSocket;
    retry = 0;
    chatroom: string;
    unread_msg_count: number;
    focus;
    username: string;

    constructor(@Inject(DOCUMENT) private document: any, private route: ActivatedRoute, private emoji: EmojiService) {
        // initialize variables
        this.unread_msg_count = 0;
        this.msg = '';
        this.emojis = this.emoji.getEmojis();
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
                const file = this.document.getElementById('file');
                if (file.files[0]) {
                    if (file.files[0].type.indexOf('image') > -1) {
                        if (file.files[0].size <= 15728640) {
                            this.getBase64(file.files[0]);
                            file.value = '';
                        } else {
                            file.value = '';
                            window.alert('file size too large');
                        }
                    } else if (file.files[0].type.indexOf('video') > -1) {
                        if (file.files[0].size <= 15728640) {
                            this.getBase64(file.files[0]);
                        } else {
                            file.value = '';
                            window.alert('file size too large');
                        }
                    } else {
                        alert('file type not supported');
                        file.value = '';
                    }
                }
            });
    }

    /**
     * coverts a file into a base64 string and then sends it to the server
     * @param file of type File
     */
    getBase64(file) {
        if (file.type === 'video/3gpp') {
            alert(file.type + ' is not supported');
            this.document.getElementById('file').value = '';
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const obj = JSON.stringify({
                type: file.type,
                file: reader.result
            });
            this.webSocket.send(obj);
            this.document.getElementById('file').value = '';
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    /**
     * wrapper function that manually clicks on the hidden file input field.
     */
    fileClick() {
        this.document.getElementById('file').click();
    }

    /**
     * appends an emoji to the message string
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
            this.webSocket = new WebSocket(`ws://038bb6db.ngrok.io/${this.chatroom}?name=${this.username}`);

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
                        if (this.retry < 3) {
                            console.log('trying to reconnect, attempt: ' + (this.retry + 1));
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
    mediaLoad() {
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
