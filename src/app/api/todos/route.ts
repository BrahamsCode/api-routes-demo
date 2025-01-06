// src/app/api/todos/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: 1, text: '✨ ¡Bienvenido! Haz clic en el círculo para completar una tarea', completed: false },
  { id: 2, text: '🗑️ Pasa el ratón sobre una tarea para eliminarla', completed: false },
];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  try {
    const todo: Todo = await request.json();
    todos = [...todos, todo];
    return NextResponse.json(todo, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear todo' }, { status: 400 });
  }
}