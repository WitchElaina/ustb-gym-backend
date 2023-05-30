const DB_NAME = 'gym';
const ACCOUNT_COLLECTION_NAME = 'account';
const RESERVATION_COLLECTION_NAME = 'reservation';
const ROOM_COLLECTION_NAME = 'room';
const CDKEY_COLLECTION_NAME = 'cdkey';

// Connect to MongoDB
const conn = new Mongo();
const db = conn.getDB(DB_NAME);

// Create users collection
db.createCollection(ACCOUNT_COLLECTION_NAME);
db.createCollection(RESERVATION_COLLECTION_NAME);
db.createCollection(ROOM_COLLECTION_NAME);
db.createCollection(CDKEY_COLLECTION_NAME);
