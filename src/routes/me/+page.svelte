<script>

	import Contacts from '$lib/components/Contacts.svelte';

	let contacts = [
		{
			username: 'johndoe',
			avatar: '/default_avatars/1.jpg',
			status: 'online'
		},
		{
			username: 'max',
			avatar: '/default_avatars/2.jpg',
			status: 'offline'
		},
		{
			username: 'longassusername',
			avatar: '/default_avatars/3.jpg',
			status: 'online'
		},
		{
			username: 'short',
			avatar: '/default_avatars/4.jpg',
			status: 'offline'
		},
		{
			username: 'typical_username',
			avatar: '/default_avatars/1.jpg',
			status: 'online'
		}
	];

</script>

<main class="w-screen">
	<!-- Contacts
    A horizontal carousel of contacts
    Each contact is a minimalist card with a name, avatar, and status
-->

	<nav class="container flex justify-center items-center">
        <Contacts contacts={contacts} />
	</nav>
</main>
