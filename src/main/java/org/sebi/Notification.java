package org.sebi;
class Notification {

    public String sender;
    public String chat;

    public Notification() {

    }

    public Notification(String chat, String sender) {
        this.chat = chat;
        this.sender = sender;
    }
}