import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';


export default defineConfig({
	server: {
		cors: true
	}, 
	preview: {
		cors: true
	},
	plugins: [await sveltekit()]
});
