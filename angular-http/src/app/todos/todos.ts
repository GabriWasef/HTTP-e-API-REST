import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Todo } from '../modelli/todo';
import { TodoService } from '../services/todo-service';

@Component({
  imports: [JsonPipe],
  selector: 'app-todos',
  styleUrl: './todos.css',
  templateUrl: './todos.html',
})
export class Todos implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);
  readonly creato = signal<Todo | null>(null);
  readonly completate = computed(() => this.todos().filter(t => t.completed).length);

  ngOnInit(): void {
    this.carica(1);
  }

  carica(userId: number): void {
    this.loading.set(true);
    this.errore.set(null);
    this.todoService.getTodos(userId).subscribe({
      next: (dati) => {
        this.todos.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Errore ${err.status}: ${err.message}`);
        this.loading.set(false);
      },
    });
  }

  aggiungi(campo: HTMLInputElement): void {
    const titolo = campo.value.trim();
    if (titolo === '') {
      return;
    }
    this.todoService.addTodo({ userId: 1, title: titolo, completed: false }).subscribe({
      next: (risposta) => {
        this.creato.set(risposta);
        campo.value = '';
      },
      error: (err: HttpErrorResponse) => this.errore.set(`Invio non riuscito: ${err.message}`),
    });
  }

  elimina(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.todos.update(lista => lista.filter(t => t.id !== id)),
      error: (err: HttpErrorResponse) => this.errore.set(`Eliminazione non riuscita: ${err.message}`),
    });
  }
}
