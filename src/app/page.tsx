'use client';

import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchTodos();
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, isClient]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Error al cargar las tareas');
      const data = await response.json();
      setTodos(data);
      setIsLoading(false);
    } catch {
      setError('Error al cargar las tareas');
      setIsLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        }),
      });

      if (!response.ok) throw new Error('Error al añadir la tarea');

      const data = await response.json();
      setTodos(prev => [...prev, data]);
      setNewTodo('');
    } catch {
      setError('Error al añadir la tarea');
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar la tarea');

      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch {
      setError('Error al actualizar la tarea');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');
      setTodos(todos.filter(t => t.id !== id));
    } catch {
      setError('Error al eliminar la tarea');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const pendingTasks = todos.filter(t => !t.completed).length;
  const completedTasks = todos.filter(t => t.completed).length;

  const filterButtons = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Pendientes' },
    { id: 'completed', label: 'Completadas' }
  ] as const;

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando tus tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-200">
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
      </button>

      {error && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-r shadow-md relative">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 right-0 p-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{pendingTasks}</p>
            <p className="text-gray-600 dark:text-gray-300">Pendientes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-500 dark:text-green-400">{completedTasks}</p>
            <p className="text-gray-600 dark:text-gray-300">Completadas</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
            <h1 className="text-3xl font-bold text-white">Lista de Tareas</h1>
            <p className="text-blue-100">Organiza tus tareas de manera eficiente</p>
          </div>

          <form onSubmit={addTodo} className="p-6 border-b dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="¿Qué necesitas hacer?"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!newTodo.trim()}
              >
                Añadir
              </button>
            </div>
          </form>

          <div className="flex justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700">
            {filterButtons.map(button => (
              <button
                key={button.id}
                onClick={() => setFilter(button.id)}
                className={`px-4 py-2 rounded-lg transition-all ${filter === button.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
              >
                {button.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTodos.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No hay tareas {filter !== 'all' ? 'en esta categoría' : ''}</p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${todo.completed
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-500'
                      }`}
                  >
                    {todo.completed && '✓'}
                  </button>

                  <span className={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}