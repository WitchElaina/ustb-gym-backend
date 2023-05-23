import express from 'express';
import cors from 'cors';
import {
  loginDb,
  registerDb,
  addReservationDb,
  findReservationDb,
  getUserInfo,
  getReservation,
  deleteReservation,
  addRoom,
  deleteRoom,
  getRoomNames,
  addRoomRound,
  getRoomRounds,
  deleteRoomRound,
  updateRoomRound,
  getAllRounds,
} from './db.js';

const app = express();
const port = 3456;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await loginDb(username, password);
  if (user) {
    // status code 200: OK
    res.status(200).send('Login success!');
  } else {
    // status code 401: Unauthorized
    res.status(401).send('Login failed!');
  }
});

app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  // 用户名重复则失败
  const userCheck = await getUserInfo(username);
  if (userCheck) {
    // status code 401: Unauthorized
    res.status(401).send('Register failed!');
    return;
  }

  const user = await registerDb(username, password, role);
  if (user) {
    // status code 200: OK
    res.status(200).send('Register success!');
  } else {
    // status code 401: Unauthorized
    res.status(401).send('Register failed!');
  }
});

app.post('/reservation', async (req, res) => {
  const username = req.body.username;
  const date = req.body.date;
  const time = req.body.time;
  const room = req.body.room;
  const ret = {};
  // 查询是否存在预定
  const user = await findReservationDb(date, time, room);
  if (user) {
    ret['status'] = 'failed';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    const user = await addReservationDb(username, date, time, room);
    if (user) {
      ret['status'] = 'success';
      // status code 200: OK
      res.status(200).send(ret);
    } else {
      ret['status'] = 'failed';
      // status code 401: Unauthorized
      res.status(401).send(ret);
    }
  }
});

app.post('/user', async (req, res) => {
  const username = req.body.username;
  const userInfo = await getUserInfo(username);
  const userReservation = await getReservation(username);
  const ret = {};
  if (userInfo && userReservation) {
    ret['status'] = 'success';
    ret['userInfo'] = userInfo;
    ret['userReservation'] = userReservation;
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/userorder', async (req, res) => {
  const username = req.body.username;
  const userReservation = await getReservation(username);
  const ret = {};
  if (userReservation) {
    ret['status'] = 'success';
    ret['userReservation'] = userReservation;
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/cancel', async (req, res) => {
  const username = req.body.username;
  const date = req.body.date;
  const time = req.body.time;
  const room = req.body.room;
  const ret = {};
  const user = await deleteReservation(username, date, time, room);
  if (user) {
    ret['status'] = 'success';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/room', async (req, res) => {
  const rooms = await getRoomNames();
  const ret = {};
  if (rooms) {
    ret['status'] = 'success';
    ret['rooms'] = rooms;
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/room/add', async (req, res) => {
  const room = req.body.room;
  const ret = {};
  const user = await addRoom(room);
  if (user) {
    ret['status'] = 'success';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/room/delete', async (req, res) => {
  const room = req.body.room;
  const ret = {};
  const user = await deleteRoom(room);
  if (user) {
    ret['status'] = 'success';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/round', async (req, res) => {
  const room = req.body.room;
  const ret = {};
  const user = await getRoomRounds(room);
  if (user) {
    ret['status'] = 'success';
    ret['rounds'] = user;
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/round/add', async (req, res) => {
  const room = req.body.room;
  const date = req.body.date;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const openFor = req.body.openFor;
  const price = req.body.price;
  const ret = {};
  const user = await addRoomRound(room, date, startTime, endTime, openFor, price);
  if (user) {
    ret['status'] = 'success';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/round/delete', async (req, res) => {
  const room = req.body.room;
  const date = req.body.date;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const ret = {};
  const user = await deleteRoomRound(room, date, startTime, endTime);
  if (user) {
    ret['status'] = 'success';
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.post('/round/all', async (req, res) => {
  const ret = {};
  const user = await getAllRounds();
  if (user) {
    ret['status'] = 'success';
    ret['rounds'] = user;
    // status code 200: OK
    res.status(200).send(ret);
  } else {
    ret['status'] = 'failed';
    ret['rounds'] = [];
    // status code 401: Unauthorized
    res.status(401).send(ret);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
