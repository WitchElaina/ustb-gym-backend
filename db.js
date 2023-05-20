import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const DB_NAME = 'gym';
const ACCOUNT_COLLECTION_NAME = 'account';
const RESERVATION_COLLECTION_NAME = 'reservation';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// 登录
export async function loginDb(username, password) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ACCOUNT_COLLECTION_NAME);
    const query = { username: username, password: password };
    const user = await users.findOne(query);
    return user;
  } finally {
    await client.close();
  }
}

// 注册
export async function registerDb(username, password, role) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ACCOUNT_COLLECTION_NAME);
    const query = {
      username: username,
      password: password,
      role: role,
    };
    const user = await users.insertOne(query);
    // RESERVATION_COLLECTION 中创建键
    const reservation = db.collection(RESERVATION_COLLECTION_NAME);
    const query2 = {
      username: username,
      reservation: [],
    };
    await reservation.insertOne(query2);
    return user;
  } finally {
    await client.close();
  }
}

// 添加预定
export async function addReservationDb(username, date, time, room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(RESERVATION_COLLECTION_NAME);
    const query = { username: username };
    const update = {
      $push: { reservation: { date: date, time: time, room: room } },
    };
    const user = await users.updateOne(query, update);
    return user;
  } finally {
    await client.close();
  }
}

// 查找特定时段是否有预定
export async function findReservationDb(date, time, room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(RESERVATION_COLLECTION_NAME);
    const query = {
      reservation: {
        $elemMatch: { date: date, time: time, room: room },
      },
    };
    const user = await users.findOne(query);
    return user;
  } finally {
    await client.close();
  }
}

export async function getUserInfo(username) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ACCOUNT_COLLECTION_NAME);
    const query = { username: username };
    const user = await users.findOne(query);
    return user;
  } finally {
    await client.close();
  }
}

export async function getReservation(username) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(RESERVATION_COLLECTION_NAME);
    const query = { username: username };
    const user = await users.findOne(query);
    return user;
  } finally {
    await client.close();
  }
}
