package com.example.unit2;

import jakarta.persistence.*;

@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String taskName;

    @Column(nullable = false)
    private int currentCount;

    @Column(nullable = false)
    private int maxCount = 5;

    @Column(nullable = false)
    private boolean achieved = false;


    public Goal() {}

    public void setCurrentCount(int i) {
    }

    public void setAchieved(boolean b) {
    }

    public int getCurrentCount() {
        return 0;
    }

    public int getMaxCount() {
        return 0;
    };
}
