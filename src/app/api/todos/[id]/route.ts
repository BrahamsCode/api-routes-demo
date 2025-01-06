export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = parseInt(params.id);
    const updatedTodo = await request.json();
    
    todos = todos.map(todo => 
      todo.id === id ? updatedTodo : todo
    );
    
    return NextResponse.json(updatedTodo);
  }
  
  export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = parseInt(params.id);
    todos = todos.filter(todo => todo.id !== id);
    return NextResponse.json({ message: `Todo ${id} deleted` });
  }