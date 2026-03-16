package com.todolist.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean completed;
    private LocalDate dueDate;
    private String recurrenceType; // null = not recurring; WEEKLY, MONTHLY, YEARLY
    private Integer dayOfWeek;     // ISO: 1=Mon..7=Sun, used for WEEKLY
    private Integer dayOfMonth;    // 1-31, used for MONTHLY and YEARLY
    private Integer monthOfYear;   // 1-12, used for YEARLY

    public Todo() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
    public LocalDate getDueDate() { return dueDate; }
    public String getRecurrenceType() { return recurrenceType; }
    public Integer getDayOfWeek() { return dayOfWeek; }
    public Integer getDayOfMonth() { return dayOfMonth; }
    public Integer getMonthOfYear() { return monthOfYear; }

    public void setTitle(String title) { this.title = title; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setRecurrenceType(String recurrenceType) { this.recurrenceType = recurrenceType; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public void setDayOfMonth(Integer dayOfMonth) { this.dayOfMonth = dayOfMonth; }
    public void setMonthOfYear(Integer monthOfYear) { this.monthOfYear = monthOfYear; }
}
