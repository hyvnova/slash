import { error, redirect, type Cookies } from '@sveltejs/kit';
import type { UserType } from '$lib/types';
import { get_by } from './db/user';

export async function requireUser(cookies: Cookies): Promise<UserType> {
	const token = cookies.get('token');
	if (!token) {
		throw redirect(302, '/');
	}

	const user = await get_by(token);
	if (!user) {
		cookies.delete('token', {
			path: '/',
			secure: process.env.NODE_ENV === 'production'
		});
		throw redirect(302, '/');
	}

	user.role ||= 'user';
	return user;
}

export async function requireAdmin(cookies: Cookies): Promise<UserType> {
	const user = await requireUser(cookies);
	if (user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	return user;
}
