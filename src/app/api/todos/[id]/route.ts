// src/app/api/todos/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Todo } from '../route';

let todos: Todo[] = [
  { id: 1, text: '✨ ¡Bienvenido! Haz clic en el círculo para completar una tarea', completed: false },
  { id: 2, text: '🗑️ Pasa el ratón sobre una tarea para eliminarla', completed: false },
];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedTodo: Todo = await request.json();
    
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Todo no encontrado' },
        { status: 404 }
      );
    }

    todos[index] = updatedTodo;
    return NextResponse.json(updatedTodo);
  } catch {
    return NextResponse.json(
      { error: 'Error al actualizar todo' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Todo no encontrado' },
        { status: 404 }
      );
    }

    todos = todos.filter(todo => todo.id !== id);
    return NextResponse.json({ message: `Todo ${id} eliminado` });
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar todo' },
      { status: 400 }
    );
  }
}