import { NextResponse } from 'next/server';

// Simulamos una base de datos con un array
let todos = [
  { id: 1, text: '✨ ¡Bienvenido! Haz clic en el círculo para completar una tarea', completed: false },
  { id: 2, text: '🗑️ Pasa el ratón sobre una tarea para eliminarla', completed: false },
];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const todo = await request.json();
  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}