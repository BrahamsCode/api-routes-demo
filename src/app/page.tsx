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
    // Cargar preferencia de tema del localStorage
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchTodos();
    }
  }, [isClient]);

  useEffect(() => {
    // Guardar preferencia de tema en localStorage
    if (isClient) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      // Actualizar la clase dark en el documento
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, isClient]);

  // ... (mantener las funciones fetchTodos, addTodo, toggleTodo, deleteTodo) ...
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
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
          text: newTodo,
          completed: false,
          id: Date.now(),
        }),
      });

      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
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

      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };


  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const pendingTasks = todos.filter(t => !t.completed).length;
  const completedTasks = todos.filter(t => t.completed).length;

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando tus tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-200">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <span className="text-xl">
          {isDark ? '☀️' : '🌙'}
        </span>
      </button>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 transform -translate-y-2 animate-slideDown">
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-r shadow-md relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 right-0 p-4 text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-all">
            <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{pendingTasks}</p>
            <p className="text-gray-600 dark:text-gray-300">Tareas Pendientes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-all">
            <p className="text-2xl font-bold text-green-500 dark:text-green-400">{completedTasks}</p>
            <p className="text-gray-600 dark:text-gray-300">Tareas Completadas</p>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
            <h1 className="text-3xl font-bold text-white">Lista de Tareas</h1>
            <p className="text-blue-100">Organiza tus tareas de manera eficiente</p>
          </div>

          {/* Formulario */}
          <form onSubmit={addTodo} className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="¿Qué necesitas hacer?"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTodo.trim()}
              >
                Añadir
              </button>
            </div>
          </form>

          {/* Filtros */}
          <div className="flex justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg transition-all ${filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
              >
                {filterType === 'all' && 'Todas'}
                {filterType === 'active' && 'Pendientes'}
                {filterType === 'completed' && 'Completadas'}
              </button>
            ))}
          </div>

          {/* Lista de tareas */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTodos.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">No hay tareas {filter !== 'all' ? 'en esta categoría' : ''}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {filter === 'all' && '¡Añade una tarea para empezar!'}
                  {filter === 'active' && '¡Todas las tareas están completadas!'}
                  {filter === 'completed' && '¡Aún no has completado ninguna tarea!'}
                </p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group animate-fadeIn"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-500 hover:border-blue-500'
                      }`}
                  >
                    {todo.completed && '✓'}
                  </button>

                  <span className={`flex-1 transition-all ${todo.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 focus:outline-none"
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