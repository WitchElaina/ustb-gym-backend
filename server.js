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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
