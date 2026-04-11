import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

for (const path of ['.env.local', '.env']) {
	dotenv.config({ path, override: false });
}

function readArgs(argv) {
	let dbName = null;
	let username = null;

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === '--db') {
			dbName = argv[index + 1];
			index += 1;
			continue;
		}

		if (arg.startsWith('--db=')) {
			dbName = arg.slice('--db='.length);
			continue;
		}

		if (!arg.startsWith('-') && !username) {
			username = arg;
		}
	}

	return { dbName, username };
}

const { dbName, username } = readArgs(process.argv.slice(2));

if (!username || !dbName || !['dev', 'prod'].includes(dbName)) {
	console.error('Usage: bun run dev-set-admin <username>');
	console.error('   or: bun run set-admin <username>');
	process.exit(1);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
	console.error('MONGODB_URI is not set. Add it to .env.local, .env, or your shell environment.');
	process.exit(1);
}

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

try {
	await client.connect();

	const users = client.db(dbName).collection('users');
	const result = await users.updateOne({ username }, { $set: { role: 'admin' } });

	if (result.matchedCount === 0) {
		console.error(`No user named "${username}" exists in the "${dbName}" database.`);
		process.exitCode = 1;
	} else {
		console.log(`User "${username}" is now an admin in the "${dbName}" database.`);
	}
} finally {
	await client.close();
}
