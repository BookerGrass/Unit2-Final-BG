package com.example.unit2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * GET /api/users - Get all users
     * @return a list of all users
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id} - Get a user by ID
     * @param id the user ID
     * @return the user if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /api/users/username/{username} - Get a user by username
     * @param username the username to search for
     * @return the user if found, or 404 Not Found
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * POST /api/users - Create a new user
     * @param user the user object to create
     * @return the created user with 201 Created status
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    /**
     * PUT /api/users/{id} - Update an existing user
     * @param id the user ID
     * @param userDetails the updated user details
     * @return the updated user, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setSkillLevel(userDetails.getSkillLevel());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * DELETE /api/users/{id} - Delete a user
     * @param id the user ID
     * @return 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/users/skill/{skillLevel} - Get all users with a specific skill level
     * @param skillLevel the skill level to filter by
     * @return a list of users with the specified skill level
     */
    @GetMapping("/skill/{skillLevel}")
    public ResponseEntity<List<User>> getUsersBySkillLevel(@PathVariable SkillLevel skillLevel) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getSkillLevel() == skillLevel)
                .toList();
        return ResponseEntity.ok(users);
    }
}

