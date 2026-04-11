<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import SettingSection from '$lib/components/SettingSection.svelte';
	import SettingsLayout from '$lib/components/SettingsLayout.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import NotificationConfigPage from '$lib/pages/NotificationConfigPage.svelte';
	import { Routes } from '$lib/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function handleSession(action: 'logout' | 'delete') {
		await fetch('/api/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: action
			})
		});
		window.location.href = '/';
	}
</script>

<Toast />

<SettingsLayout backHref={Routes.HOME} backLabel="home">
	<NotificationConfigPage />

	<SettingSection title="storage" description="review uploaded files and the quota they occupy.">
		<div class="action-row">
			<Button href={Routes.UPLOADS} variant="secondary">my uploads</Button>
			{#if data.user.role === 'admin'}
				<Button href={Routes.ADMIN_FILES} variant="danger">admin files</Button>
			{/if}
		</div>
	</SettingSection>

	<SettingSection
		title="account"
		description="session controls and destructive account actions. use the red switch with intent."
	>
		<div class="action-row">
			<Button variant="secondary" onclick={() => handleSession('logout')}>logout</Button>
			<Button variant="danger" onclick={() => handleSession('delete')}>delete</Button>
		</div>
	</SettingSection>
</SettingsLayout>

<style>
	.action-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		min-width: 0;
	}
</style>
