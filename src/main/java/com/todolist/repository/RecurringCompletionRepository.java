package com.todolist.repository;

import com.todolist.model.RecurringCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface RecurringCompletionRepository extends JpaRepository<RecurringCompletion, Long> {
    Optional<RecurringCompletion> findByRecurringTodoIdAndOccurrenceDate(Long recurringTodoId, LocalDate occurrenceDate);
    void deleteByRecurringTodoId(Long recurringTodoId);
    Optional<RecurringCompletion> findByRecurringTodoIdAndOccurrenceDateAndType(Long recurringTodoId, LocalDate occurrenceDate, String type);
    boolean existsByRecurringTodoIdAndOccurrenceDateAndType(Long recurringTodoId, LocalDate occurrenceDate, String type);
}
