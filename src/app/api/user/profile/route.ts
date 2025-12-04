import { auth } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  idle_timeout: 20,
});

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const userId = session.user.id;

    // Update user profile in database
    if (session.user.account_type === 'seller') {
      await sql`
        UPDATE users 
        SET 
          shop_name = ${data.shopName || null},
          bio = ${data.bio || null},
          updated_at = NOW()
        WHERE id = ${userId}
      `;
    } else {
      await sql`
        UPDATE users 
        SET 
          bio = ${data.bio || null},
          updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    // In production, you might also update notification preferences in a separate table

    return NextResponse.json({
      message: 'Profile updated successfully',
      success: true,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    const user = await sql`
      SELECT 
        id, email, fname, lname, account_type,
        shop_name, bio, created_at
      FROM users 
      WHERE id = ${userId}
    `;

    return NextResponse.json({
      user: user[0] || null,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}