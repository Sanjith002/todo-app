package com.sanjith.demo.controllers;

import com.sanjith.demo.services.TodoService;
import com.sanjith.demo.models.Todo;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "500", description = "Todo not found")
    })
//    @GetMapping("/{id}")
//    ResponseEntity<Todo> getTodoById(@PathVariable Integer id){
//        return new ResponseEntity<>(todoService.findTodoById(id), HttpStatus.OK);
//    }

    @GetMapping("/get")
    ResponseEntity<List<Todo>> getTodo(){
        return new ResponseEntity<>(todoService.getAllTodo(), HttpStatus.OK);
    }

//    @GetMapping("/page")
//    ResponseEntity<Page<Todo>> getTodoPage(@RequestParam Integer page, @RequestParam Integer size){
//        return new ResponseEntity<>(todoService.getAllTodoPage(page, size), HttpStatus.OK);
//    }

    @PostMapping("/create")
    ResponseEntity<Todo> create_todo(@RequestBody Todo todo){
        System.out.println("POST HIT");
        return new ResponseEntity<>(todoService.createTodo(todo), HttpStatus.CREATED);
    }

    @PutMapping
    ResponseEntity<Todo> updateTodoByIdParam(@RequestBody Todo todo){
        return new ResponseEntity<>(todoService.updateTodo(todo), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    void deleteTodoByIdParam(@PathVariable Integer id){
        todoService.deleteTodoById(id);
    }
}
