package com.example.unit2;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser_Id(Long userId);
    List<Goal> findByUser_IdAndAchieved(Long userId, boolean achieved);
}
