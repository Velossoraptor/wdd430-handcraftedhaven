// app/api/auth/check/route.ts
import { NextResponse } from 'next/server'; // Removed NextRequest
import { cookies } from 'next/headers';

export async function GET() { // Removed request parameter
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false });
    }
    
    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        return NextResponse.json({ isAuthenticated: false });
      }
      
      return NextResponse.json({ 
        isAuthenticated: true, 
        user: { email: session.email }
      });
    } catch (error) {
      return NextResponse.json({ isAuthenticated: false });
    }
    
  } catch (error) {
    return NextResponse.json({ 
      isAuthenticated: false,
      error: 'Failed to check authentication status' 
    }, { status: 500 });
  }
}