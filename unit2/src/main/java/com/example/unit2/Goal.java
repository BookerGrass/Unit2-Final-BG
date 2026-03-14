package com.example.unit2;

import jakarta.persistence.*;
// Defines the Goal entity with fields for id, user, taskName, currentCount, maxCount, and achieved. Includes constructors, getters, and setters for each field. The user field is a many-to-one relationship with the User entity, and the getUserId and setUserId methods allow for handling the user reference without exposing the entire User object.
@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String taskName;

    @Column(nullable = false)
    private int currentCount;

    @Column(nullable = false)
    private int maxCount = 5;

    @Column(nullable = false)
    private boolean achieved = false;


    public Goal() {}

    public Goal(Long userId, String taskName, int currentCount, int maxCount, boolean achieved) {
        this.user = userId == null ? null : createUserRef(userId);
        this.taskName = taskName;
        this.currentCount = currentCount;
        this.maxCount = maxCount;
        this.achieved = achieved;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public void setUserId(Long userId) {
        this.user = userId == null ? null : createUserRef(userId);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public int getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(int currentCount) {
        this.currentCount = currentCount;
    }

    public int getMaxCount() {
        return maxCount;
    }

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
    }

    public boolean isAchieved() {
        return achieved;
    }

    public void setAchieved(boolean achieved) {
        this.achieved = achieved;
    }

    private User createUserRef(Long userId) {
        User userRef = new User();
        userRef.setId(userId);
        return userRef;
    }
}
