import { NextRequest, NextResponse } from 'next/server';
import adminData from '@/data/admin.json';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        console.log(username, password);


        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        console.log(adminData);
        // Find admin user
        const admin = adminData.find(
            (user: any) => user.username === username && user.password === password
        );
        console.log(admin);


        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Return user info (password not included in response)
        const { password: _, ...userInfo } = admin;
        return NextResponse.json(userInfo, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
