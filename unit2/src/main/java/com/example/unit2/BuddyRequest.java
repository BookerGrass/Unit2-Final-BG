package com.example.unit2;
//Sets up BuddyRequest class to handle incoming buddy requests with a single field for the buddy's username. Includes constructors, getters, and setters for the buddy field.
public class BuddyRequest {
    private String buddy;

    public BuddyRequest() {
    }

    public BuddyRequest(String buddy) {
        this.buddy = buddy;
    }

    public String getBuddy() {
        return buddy;
    }

    public void setBuddy(String buddy) {
        this.buddy = buddy;
    }
}

