import { MongoMemoryServer } from 'mongodb-memory-server';

console.log('[MongoMemoryServer] Initializing instance...');
try {
  const mongod = await MongoMemoryServer.create();
  console.log('[MongoMemoryServer] Binary downloaded and ready! URI:', mongod.getUri());
  await mongod.stop();
  process.exit(0);
} catch (err) {
  console.error('[MongoMemoryServer] Error starting instance:', err);
  process.exit(1);
}
