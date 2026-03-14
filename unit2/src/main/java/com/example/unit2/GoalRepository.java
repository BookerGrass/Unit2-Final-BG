package com.example.unit2;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
// Sets up the GoalRepository interface, which extends JpaRepository to provide CRUD operations for Goal entities. It also includes custom query methods to find goals by user ID and filter by achievement status.
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser_Id(Long userId);
    List<Goal> findByUser_IdAndAchieved(Long userId, boolean achieved);
}
