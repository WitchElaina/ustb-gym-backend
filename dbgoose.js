import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const DB_NAME = 'gym';
const ACCOUNT_COLLECTION_NAME = 'account';
const RESERVATION_COLLECTION_NAME = 'reservation';
const ROOM_COLLECTION_NAME = 'room';
const CDKEY_COLLECTION_NAME = 'cdkey';

const client = mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.log(err);
  });

const accountSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: String,
    balance: Number,
  },
  { collection: ACCOUNT_COLLECTION_NAME },
);

const reservationSchema = new mongoose.Schema(
  {
    username: String,
    reservation: Array,
  },
  { collection: RESERVATION_COLLECTION_NAME },
);

const roomSchema = new mongoose.Schema(
  {
    room: String,
    round: Array,
  },
  { collection: ROOM_COLLECTION_NAME },
);

const cdkeySchema = new mongoose.Schema(
  {
    cdkey: String,
    balance: Number,
  },
  { collection: CDKEY_COLLECTION_NAME },
);

export async function loginDb(username, password) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);

    const result = await Account.findOne({
      username: username,
      password: password,
    });
    console.log('login', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function registerDb(username, password, role) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);

    const result = await Account.create({
      username: username,
      password: password,
      role: role,
      balance: 0,
    });
    console.log('register', result);

    // RESERVATION_COLLECTION 中创建
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);
    await Reservation.create({
      username: username,
      reservation: [],
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addReservationDb(username, date, time, room) {
  try {
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);

    const result = await Reservation.findOneAndUpdate(
      { username: username },
      { $push: { reservation: { date: date, time: time, room: room } } },
    );
    console.log('addReservation', result);
    // 分割time为startTime和endTime
    const startTime = time.split('-')[0];
    const endTime = time.split('-')[1];

    // 修改round中的reserver
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result2 = await Room.findOneAndUpdate(
      {
        room: room,
        round: {
          $elemMatch: {
            date: date,
            startTime: startTime,
            endTime: endTime,
          },
        },
      },
      {
        $set: { 'round.$.reserver': username },
      },
    );
    console.log('addReservation', result2);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function findReservationDb(date, time, room) {
  try {
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);
    const result = await Reservation.findOne({
      reservation: {
        $elemMatch: {
          date: date,
          time: time,
          room: room,
        },
      },
    });
    console.log('findReservation', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserInfo(username) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOne({
      username: username,
    });
    console.log('getUserInfo', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getReservation(username) {
  try {
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);
    const result = await Reservation.findOne({
      username: username,
    });
    console.log('getReservation', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteReservation(username, date, time, room) {
  try {
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);
    const result = await Reservation.findOneAndUpdate(
      {
        username: username,
      },
      {
        $pull: {
          reservation: {
            date: date,
            time: time,
            room: room,
          },
        },
      },
    );
    console.log('deleteReservation', result);
    // 分割time为startTime和endTime
    const startTime = time.split('-')[0];
    const endTime = time.split('-')[1];

    // 修改round中的reserver
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result2 = await Room.findOneAndUpdate(
      {
        room: room,
        round: {
          $elemMatch: {
            date: date,
            startTime: startTime,
            endTime: endTime,
          },
        },
      },
      {
        $set: { 'round.$.reserver': 'none' },
      },
    );
    console.log('deleteReservation', result2);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addRoom(room) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.create({
      room: room,
      round: [],
    });
    console.log('addRoom', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteRoom(room) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.deleteOne({
      room: room,
    });
    console.log('deleteRoom', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoomNames() {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.find();
    console.log('getRoomNames', result);
    const names = [];
    for (let i = 0; i < result.length; i++) {
      names.push(result[i].room);
    }
    return names;
  } catch (error) {
    console.log(error);
  }
}

export async function addRoomRound(room, date, startTime, endTime, openFor, price) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.findOneAndUpdate(
      {
        room: room,
      },
      {
        $push: {
          round: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            openFor: openFor,
            price: price,
            reserver: 'none',
          },
        },
      },
    );
    console.log('addRoomRound', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllRounds() {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.find();
    const rounds = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].round.length; j++) {
        result[i].round[j].room = result[i].room;
        rounds.push(result[i].round[j]);
      }
    }
    console.log('getAllRounds', rounds);
    return rounds;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoomRounds(room) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.findOne({
      room: room,
    });
    console.log('getRoomRounds', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteRoomRound(room, date, startTime, endTime) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.findOneAndUpdate(
      {
        room: room,
      },
      {
        $pull: {
          round: {
            date: date,
            startTime: startTime,
            endTime: endTime,
          },
        },
      },
    );
    console.log('deleteRoomRound', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// todo
export async function updateRoomRound(room, date, time, price) {
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.findOneAndUpdate(
      {
        room: room,
        round: {
          $elemMatch: {
            date: date,
            startTime: time.split('-')[0],
            endTime: time.split('-')[1],
          },
        },
      },
      {
        $set: { 'round.$.price': price },
      },
    );
    console.log('updateRoomRound', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function payDb(username, price) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOneAndUpdate(
      {
        username: username,
      },
      {
        $inc: { balance: -price },
      },
    );
    console.log('payDb', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getBalance(username) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOne({
      username: username,
    });
    console.log('getBalance', result);
    return result.balance;
  } catch (error) {
    console.log(error);
  }
}

export async function addBalance(username, price) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOneAndUpdate(
      {
        username: username,
      },
      {
        $inc: { balance: price },
      },
    );
    console.log('addBalance', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addCDkey(cdkey, balance) {
  try {
    const CDkey = mongoose.model(CDKEY_COLLECTION_NAME, cdkeySchema);
    const result = await CDkey.create({
      cdkey: cdkey,
      balance: balance,
    });
    console.log('addCDkey', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getCDkey(cdkey) {
  try {
    const CDkey = mongoose.model(CDKEY_COLLECTION_NAME, cdkeySchema);
    const result = await CDkey.findOne({
      cdkey: cdkey,
    });
    console.log('getCDkey', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCDkeys() {
  try {
    const CDkey = mongoose.model(CDKEY_COLLECTION_NAME, cdkeySchema);
    const result = await CDkey.find();
    const cdkeys = [];
    for (let i = 0; i < result.length; i++) {
      cdkeys.push({
        cdkey: result[i].cdkey,
        balance: result[i].balance,
      });
    }
    console.log('getAllCDkeys', cdkeys);
    return cdkeys;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCDkey(cdkey) {
  try {
    const CDkey = mongoose.model(CDKEY_COLLECTION_NAME, cdkeySchema);
    const result = await CDkey.findOneAndDelete({
      cdkey: cdkey,
    });
    console.log('deleteCDkey', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllRoomRounds() {
  // [{room,round:[..rounds..]}, {room,round:[..rounds..]}]
  try {
    const Room = mongoose.model(ROOM_COLLECTION_NAME, roomSchema);
    const result = await Room.find();
    const roomRounds = [];
    for (let i = 0; i < result.length; i++) {
      roomRounds.push({
        room: result[i].room,
        round: result[i].round,
      });
    }
    console.log('getAllRoomRounds', roomRounds);
    return roomRounds;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUser() {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.find();
    const users = [];
    for (let i = 0; i < result.length; i++) {
      users.push({
        username: result[i].username,
        password: result[i].password,
        role: result[i].role,
        balance: result[i].balance,
      });
    }
    console.log('getAllUser', users);
    return users;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUser(username, password, balance, role) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOneAndUpdate(
      {
        username: username,
      },
      {
        $set: {
          password: password,
          balance: balance,
          role: role,
        },
      },
    );
    console.log('updateUser', result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(username) {
  try {
    const Account = mongoose.model(ACCOUNT_COLLECTION_NAME, accountSchema);
    const result = await Account.findOneAndDelete({
      username: username,
    });
    console.log('deleteUser', result);
    // 删除reservation中的user
    const Reservation = mongoose.model(RESERVATION_COLLECTION_NAME, reservationSchema);
    const result2 = await Reservation.deleteMany({
      username: username,
    });
    console.log('deleteUser', result2);
    return result;
  } catch (error) {
    console.log(error);
  }
}
