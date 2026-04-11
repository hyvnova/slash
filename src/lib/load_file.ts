import { get, type Writable } from 'svelte/store';
import { FileLoadState, Routes } from './types';
import { cached } from './stores/cached';
import { MAX_FILE_LOAD_TRIES } from '$lib';

export async function load_file(
	state: Writable<FileLoadState>,
	id: string,
	use_cache: boolean = true
) {
	let url = `${Routes.FILE}/${id}`;
	let tries = 0;

	const get_file = async () => {
		if (use_cache && get(cached)[id]) {
			url = get(cached)[id];
			state.set(FileLoadState.LOADED);
		} else {
			let res = await fetch(`${Routes.FILE}/${id}`, { method: 'HEAD' });
			if (res.ok) {
				cached.update((c) => ({ ...c, [id]: url }));
				state.set(FileLoadState.LOADED);
			} else if (res.status === 404 || res.status === 410) {
				state.set(FileLoadState.DELETED);
			} else {
				if (tries < MAX_FILE_LOAD_TRIES) {
					tries++;
					setTimeout(get_file, 1000 * tries);
				} else {
					state.set(FileLoadState.FAILED);
				}
			}
		}
	};
	await get_file();
	return url;
}
