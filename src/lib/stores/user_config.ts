import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type NotificationConfigType = {
	enabled: boolean;
	sound: boolean;
	vibrate: boolean;
};

type UserConfig = {
	notifications: {
		general: NotificationConfigType;
		custom: Record<string, NotificationConfigType>;
	};
};

const default_value: UserConfig = {
	notifications: {
		general: {
			enabled: false,
			sound: true,
			vibrate: false
		},
		custom: {}
	}
};

function normalize_config(value: Partial<UserConfig> | null): UserConfig {
	return {
		notifications: {
			general: {
				...default_value.notifications.general,
				...(value?.notifications?.general ?? {})
			},
			custom: value?.notifications?.custom ?? {}
		}
	};
}

function load_config() {
	if (!browser) return default_value;

	try {
		return normalize_config(JSON.parse(localStorage.getItem('user_config') || 'null'));
	} catch {
		return default_value;
	}
}

const user_config = writable<UserConfig>(load_config());

user_config.subscribe((value) => {
	if (browser) {
		localStorage.setItem('user_config', JSON.stringify(normalize_config(value)));
	}
});

export default user_config;
