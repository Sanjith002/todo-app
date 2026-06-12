package com.sanjith.demo.repository;

import com.sanjith.demo.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TodoRepository extends JpaRepository<Todo, Integer> {
}
