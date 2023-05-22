import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const DB_NAME = 'gym';
const ACCOUNT_COLLECTION_NAME = 'account';
const RESERVATION_COLLECTION_NAME = 'reservation';
const ROOM_COLLECTION_NAME = 'room';

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
    // 添加到reservation属性的数组中
    const update = {
      $push: {
        reservation: {
          date: date,
          time: time,
          room: room,
        },
      },
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

export async function deleteReservation(username, date, time, room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(RESERVATION_COLLECTION_NAME);
    const query = { username: username };
    const update = {
      $pull: {
        reservation: {
          date: date,
          time: time,
          room: room,
        },
      },
    };
    // 删除reservation属性的数组中的某个元素
    const user = await users.updateOne(query, update);

    return user;
  } finally {
    await client.close();
  }
}

export async function addRoom(room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = {
      room: room,
      round: [],
    };
    const user = await users.insertOne(query);
    return user;
  } finally {
    await client.close();
  }
}

export async function deleteRoom(room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = { room: room };
    const user = await users.deleteOne(query);
    return user;
  } finally {
    await client.close();
  }
}

export async function getRoomNames() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const names = [];
    const cursor = users.find();
    await cursor.forEach((doc) => {
      names.push(doc.room);
    });
    return names;
  } finally {
    await client.close();
  }
}

export async function addRoomRound(room, date, startTime, endTime, openFor, price) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = { room: room };
    const update = {
      $push: {
        round: {
          date: date,
          startTime: startTime,
          endTime: endTime,
          openFor: openFor,
          price: price,
        },
      },
    };
    const user = await users.updateOne(query, update);
    return user;
  } finally {
    await client.close();
  }
}

export async function getAllRounds() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const rounds = [];
    const cursor = users.find();
    await cursor.forEach((doc) => {
      rounds.push(doc.round);
    });
    return rounds;
  } finally {
    await client.close();
  }
}

export async function getRoomRounds(room) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = { room: room };
    const user = await users.findOne(query);
    return user;
  } finally {
    await client.close();
  }
}

export async function deleteRoomRound(room, date, startTime, endTime) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = { room: room };
    const update = {
      $pull: {
        round: {
          date: date,
          startTime: startTime,
          endTime: endTime,
        },
      },
    };
    const user = await users.updateOne(query, update);
    return user;
  } finally {
    await client.close();
  }
}

// todo
export async function updateRoomRound(room, date, time, price) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection(ROOM_COLLECTION_NAME);
    const query = { room: room, 'round.date': date, 'round.time': time };
    const update = {
      $set: {
        'round.$.date': date,
        'round.$.time': time,
        'round.$.price': price,
      },
    };
    const user = await users.updateOne(query, update);
    return user;
  } finally {
    await client.close();
  }
}
