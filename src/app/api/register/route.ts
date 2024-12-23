import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accountName, password, isAdmin = false } = await req.json();

    // Montar a requisição ao backend
    const response = await fetch(`${process.env.BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Inclui a API_KEY se necessário
        'x-api-key': process.env.API_KEY || ''
      },
      body: JSON.stringify({ accountName, password, isAdmin })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error('Erro ao chamar o backend:', error.message);
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 }
    );
  }
}
