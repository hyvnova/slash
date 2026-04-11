import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/auth';
import { get_admin_files } from '$lib/server/db/files';

export const load: PageServerLoad = async ({ cookies, url }) => {
	await requireAdmin(cookies);

	const page = Number(url.searchParams.get('page') ?? '1');
	const pageSize = Number(url.searchParams.get('pageSize') ?? '25');
	const filter = (url.searchParams.get('filter') ?? 'all') as
		| 'all'
		| 'active'
		| 'deleted'
		| 'orphaned'
		| 'legacy';

	return {
		files: await get_admin_files({
			page,
			pageSize,
			filter
		})
	};
};
