package com.todolist.controller;

import com.todolist.model.RecurringCompletion;
import com.todolist.model.Todo;
import com.todolist.repository.RecurringCompletionRepository;
import com.todolist.repository.TodoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/todos")
public class TodoController {

    public record TodoResponse(
            Long id, String title, boolean completed, LocalDate dueDate,
            String recurrenceType, Integer dayOfWeek, Integer dayOfMonth, Integer monthOfYear) {}

    private final TodoRepository todoRepository;
    private final RecurringCompletionRepository recurringCompletionRepository;

    public TodoController(TodoRepository todoRepository,
                          RecurringCompletionRepository recurringCompletionRepository) {
        this.todoRepository = todoRepository;
        this.recurringCompletionRepository = recurringCompletionRepository;
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/date/{date}")
    public List<TodoResponse> getTodosByDate(@PathVariable LocalDate date) {
        List<TodoResponse> regular = todoRepository.findByDueDateAndRecurrenceTypeIsNull(date)
                .stream()
                .map(t -> toResponse(t, null))
                .collect(Collectors.toList());
        List<TodoResponse> recurring = todoRepository.findByRecurrenceTypeIsNotNull()
                .stream()
                .filter(t -> !t.getDueDate().isAfter(date))
                .filter(t -> matchesDate(t, date))
                .filter(t -> !isSkipped(t.getId(), date))
                .map(t -> toResponse(t, date))
                .collect(Collectors.toList());
        return Stream.concat(regular.stream(), recurring.stream()).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        Todo saved = todoRepository.save(todo);
        return ResponseEntity.created(URI.create("/todos/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return todoRepository.findById(id).map(existing -> {
            existing.setTitle(todo.getTitle());
            existing.setCompleted(todo.isCompleted());
            existing.setDueDate(todo.getDueDate());
            existing.setRecurrenceType(todo.getRecurrenceType());
            existing.setDayOfWeek(todo.getDayOfWeek());
            existing.setDayOfMonth(todo.getDayOfMonth());
            existing.setMonthOfYear(todo.getMonthOfYear());
            return ResponseEntity.ok(todoRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TodoResponse> toggleComplete(@PathVariable Long id,
                                                       @RequestParam(required = false) LocalDate date) {
        return todoRepository.findById(id).map(todo -> {
            if (todo.getRecurrenceType() == null) {
                todo.setCompleted(!todo.isCompleted());
                todoRepository.save(todo);
                return ResponseEntity.ok(toResponse(todo, null));
            } else {
                var existing = recurringCompletionRepository
                        .findByRecurringTodoIdAndOccurrenceDateAndType(id, date, "COMPLETED");
                if (existing.isPresent()) {
                    recurringCompletionRepository.delete(existing.get());
                } else {
                    recurringCompletionRepository.save(new RecurringCompletion(id, date));
                }
                return ResponseEntity.ok(toResponse(todo, date));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id,
                                           @RequestParam(required = false) LocalDate date) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Todo todo = todoRepository.findById(id).get();
        if (todo.getRecurrenceType() != null && date != null) {
            if (!isSkipped(id, date)) {
                recurringCompletionRepository.save(new RecurringCompletion(id, date, "SKIPPED"));
            }
            return ResponseEntity.noContent().build();
        }
        recurringCompletionRepository.deleteByRecurringTodoId(id);
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean matchesDate(Todo todo, LocalDate date) {
        return switch (todo.getRecurrenceType()) {
            case "WEEKLY" -> date.getDayOfWeek().getValue() == todo.getDayOfWeek();
            case "MONTHLY" -> date.getDayOfMonth() == todo.getDayOfMonth();
            case "YEARLY" -> date.getDayOfMonth() == todo.getDayOfMonth()
                    && date.getMonthValue() == todo.getMonthOfYear();
            default -> false;
        };
    }

    private boolean isSkipped(Long id, LocalDate date) {
        return recurringCompletionRepository
                .existsByRecurringTodoIdAndOccurrenceDateAndType(id, date, "SKIPPED");
    }

    private TodoResponse toResponse(Todo todo, LocalDate date) {
        boolean completed;
        if (todo.getRecurrenceType() == null) {
            completed = todo.isCompleted();
        } else {
            completed = recurringCompletionRepository
                    .findByRecurringTodoIdAndOccurrenceDateAndType(todo.getId(), date, "COMPLETED")
                    .isPresent();
        }
        return new TodoResponse(todo.getId(), todo.getTitle(), completed, todo.getDueDate(),
                todo.getRecurrenceType(), todo.getDayOfWeek(), todo.getDayOfMonth(), todo.getMonthOfYear());
    }
}
