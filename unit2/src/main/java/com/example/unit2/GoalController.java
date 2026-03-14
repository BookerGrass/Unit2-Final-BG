package com.example.unit2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// Sets up RESTful API endpoints for managing goals, including creating, updating, retrieving, and deleting goals associated with users. It also includes endpoints to filter goals based on their achievement status.
@RestController
@RequestMapping("/api/goals")
@CrossOrigin
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Goal>> getGoalsByUserId(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUser_Id(userId);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/user/{userId}/achieved")
    public ResponseEntity<List<Goal>> getAchievedGoals(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUser_IdAndAchieved(userId, true);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/user/{userId}/in-progress")
    public ResponseEntity<List<Goal>> getInProgressGoals(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUser_IdAndAchieved(userId, false);
        return ResponseEntity.ok(goals);
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        Long userId = goal.getUserId();
        if (userId == null || !userRepository.existsById(userId)) {
            return ResponseEntity.badRequest().build();
        }
        goal.setCurrentCount(0);
        goal.setAchieved(false);
        Goal savedGoal = goalRepository.save(goal);
        return ResponseEntity.ok(savedGoal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goal.setCurrentCount(goalDetails.getCurrentCount());
                    if (goalDetails.getCurrentCount() >= goal.getMaxCount()) {
                        goal.setAchieved(true);
                    }
                    Goal updatedGoal = goalRepository.save(goal);
                    return ResponseEntity.ok(updatedGoal);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
