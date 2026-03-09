package com.example.unit2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Goal>> getGoalsByUserId(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/user/{userId}/achieved")
    public ResponseEntity<List<Goal>> getAchievedGoals(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUserIdAndAchieved(userId, true);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/user/{userId}/in-progress")
    public ResponseEntity<List<Goal>> getInProgressGoals(@PathVariable Long userId) {
        List<Goal> goals = goalRepository.findByUserIdAndAchieved(userId, false);
        return ResponseEntity.ok(goals);
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
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
