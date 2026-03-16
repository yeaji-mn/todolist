package com.todolist.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "recurring_completions")
public class RecurringCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long recurringTodoId;
    private LocalDate occurrenceDate;

    @Column(columnDefinition = "varchar(20) default 'COMPLETED'")
    private String type = "COMPLETED";

    public RecurringCompletion() {}

    public RecurringCompletion(Long recurringTodoId, LocalDate occurrenceDate) {
        this.recurringTodoId = recurringTodoId;
        this.occurrenceDate = occurrenceDate;
    }

    public RecurringCompletion(Long recurringTodoId, LocalDate occurrenceDate, String type) {
        this.recurringTodoId = recurringTodoId;
        this.occurrenceDate = occurrenceDate;
        this.type = type;
    }

    public Long getId() { return id; }
    public Long getRecurringTodoId() { return recurringTodoId; }
    public LocalDate getOccurrenceDate() { return occurrenceDate; }
    public String getType() { return type; }
}
