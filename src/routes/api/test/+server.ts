import { json, type RequestHandler } from '@sveltejs/kit';
import { add_user, get_from, set_user, update_user } from '$lib/server/db';
import type { UserType } from '$lib/types';

export const GET: RequestHandler = async ({request}) => {
    // Number of users to create = 10

    // hardcode some user names here 
    let names = ['coolDude123',
        'sunnyDays22',
        'sparkleQueen',
        'mysterySolver',
        'guitarHero77',
        'pizzaLover99',
        'adventureSeeker',
        'sillyGoose22',
        'codingNinja',
        'starGazer88']

    let created: UserType[] = []

    // Generate 10 users each user must have username, password 
    
    for (let name of names) {
        let data = {
            username: name,
            password: 'password'
        }

        await add_user(data);
        created.push(data as UserType)
    }

    await update_user('nova', { $push: { pending_requests: { $each: names } } })
    return json(created)
};

