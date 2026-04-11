import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const chat_id = params.id;

	return { chat_id };
};
