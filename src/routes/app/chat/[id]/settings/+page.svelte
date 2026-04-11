<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/Button.svelte';
	import user_config from '$lib/stores/user_config';
	import { Routes } from '$lib/types';
	import type { PageData } from './$types';
	import Toast from '$lib/components/Toast.svelte';
	import toast from '$lib/stores/toast';
	import SettingsLayout from '$lib/components/SettingsLayout.svelte';
	import SettingSection from '$lib/components/SettingSection.svelte';
	import type { NotificationConfigType } from '$lib/stores/user_config';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const chat_id = $derived(data.chat_id);
	const default_chat_config: NotificationConfigType = {
		enabled: true,
		sound: true,
		vibrate: false
	};

	let chat_config = $derived($user_config.notifications.custom[chat_id] ?? default_chat_config);

	function ensure_chat_config() {
		user_config.update((config) => {
			config.notifications.custom[chat_id] ??= { ...default_chat_config };
			return config;
		});
	}

	$effect(() => {
		ensure_chat_config();
	});

	async function request_notification_permission() {
		if (!browser || !('Notification' in window)) {
			toast.set({
				type: 'info',
				title: 'notifications unavailable',
				message: 'this browser does not expose notification permission.',
				duration: 5000
			});
			return;
		}

		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			user_config.update((config) => {
				config.notifications.custom[chat_id] ??= { ...default_chat_config };
				config.notifications.custom[chat_id].enabled = true;
				return config;
			});

			new Notification('Notifications enabled', {
				body: 'this chat can tap the glass when it moves.',
				icon: '/favicon.ico'
			});
		} else {
			toast.set({
				type: 'info',
				title: 'permission stayed closed',
				duration: 5000,
				message: 'allow notifications in the browser settings to use this switch.'
			});
		}
	}

	function disable_notifications() {
		user_config.update((config) => {
			config.notifications.custom[chat_id] ??= { ...default_chat_config };
			config.notifications.custom[chat_id].enabled = false;
			return config;
		});
	}

	function set_chat_option(key: 'sound' | 'vibrate', checked: boolean) {
		user_config.update((config) => {
			config.notifications.custom[chat_id] ??= { ...default_chat_config };
			config.notifications.custom[chat_id][key] = checked;
			return config;
		});
	}
</script>

<Toast />

<SettingsLayout
	title="chat settings"
	description="one chat. one set of taps."
	backHref={`${Routes.CHAT}/${chat_id}`}
	backLabel="chat"
>
	<SettingSection title="notifications" description="custom alerts for this channel.">
		{#if !chat_config.enabled}
			<div class="setting-copy">
				<p>this chat is quiet until you let it speak.</p>
				<Button onclick={request_notification_permission}>enable</Button>
			</div>
		{:else}
			<div class="setting-copy">
				<p>these values override your global defaults for this chat only.</p>
			</div>

			<div class="switch-list">
				<label class="switch-row" for="sound">
					<span>
						<strong>sound</strong>
						<small>play the small ping.</small>
					</span>
					<input
						type="checkbox"
						id="sound"
						name="sound"
						checked={chat_config.sound}
						onchange={(event) => set_chat_option('sound', event.currentTarget.checked)}
					/>
				</label>

				<label class="switch-row" for="vibrate">
					<span>
						<strong>vibrate</strong>
						<small>ask mobile devices to tap back.</small>
					</span>
					<input
						type="checkbox"
						id="vibrate"
						name="vibrate"
						checked={chat_config.vibrate}
						onchange={(event) => set_chat_option('vibrate', event.currentTarget.checked)}
					/>
				</label>
			</div>

			<Button variant="secondary" onclick={disable_notifications}>disable</Button>
		{/if}
	</SettingSection>
</SettingsLayout>

<style>
	.setting-copy {
		display: grid;
		gap: 0.9rem;
		max-width: 34rem;
	}

	p {
		margin: 0;
		color: var(--text-soft);
		line-height: 1.55;
	}

	.switch-list {
		display: grid;
		gap: 0.65rem;
		margin-bottom: 1rem;
	}

	.switch-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 3.4rem;
		padding: 0.8rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.36);
	}

	.switch-row span {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	strong,
	small {
		font-family: var(--font-mono);
		line-height: 1.35;
	}

	strong {
		color: var(--text);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	small {
		color: var(--muted);
		font-size: 0.7rem;
	}

	input {
		width: 2.55rem;
		height: 1.4rem;
		flex: 0 0 auto;
		appearance: none;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		background: var(--bg-elev-soft);
		cursor: pointer;
		position: relative;
		transition:
			background var(--transition-fast),
			border-color var(--transition-fast);
	}

	input::after {
		content: '';
		position: absolute;
		top: 0.2rem;
		left: 0.22rem;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 999px;
		background: var(--muted);
		transition:
			transform var(--transition-fast),
			background var(--transition-fast);
	}

	input:checked {
		border-color: rgba(121, 166, 163, 0.55);
		background: rgba(121, 166, 163, 0.14);
	}

	input:checked::after {
		transform: translateX(1.05rem);
		background: var(--signal);
	}

	@media (max-width: 30rem) {
		.switch-row {
			align-items: flex-start;
		}
	}
</style>
