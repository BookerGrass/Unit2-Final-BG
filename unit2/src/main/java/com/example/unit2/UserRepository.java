package com.example.unit2;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
// Sets up the UserRepository interface, which extends JpaRepository to provide CRUD operations for User entities. It also includes custom query methods to find users by username and email, as well as a method to check if a username already exists.
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
}

