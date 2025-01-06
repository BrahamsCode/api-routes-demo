'use client';
import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  // Definimos el estado y realmente lo usamos
  const [todos, setTodos] = useState<Todo[]>([]);

  // Usamos useEffect para cargar los todos cuando el componente se monta
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">API Routes Demo</h1>
        
        <div className="space-y-2">
          {todos.map(todo => (
            <div key={todo.id} className="p-4 bg-white rounded shadow">
              <p>{todo.text}</p>
              <p className="text-sm text-gray-500">
                Estado: {todo.completed ? 'Completado' : 'Pendiente'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}