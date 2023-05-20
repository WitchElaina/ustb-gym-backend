# 后端

## API

### POST login

```json
{
  "username": "",
  "password": ""
}
```

### POST register

```json
{
  "username": "",
  "password": "",
  "role": ""
}
```

### GET order

```json
[
  {
    "id": "",
    "date": "2020-01-01",
    "time": "1",
    "room": "A",
    "username": ""
  },
  {
    "id": "",
    "date": "2020-01-01",
    "time": "2",
    "room": "B",
    "username": ""
  }
]
```

### POST appointment

```json
{
  "date": "2020-01-01",
  "time": "1",
  "room": "A",
  "username": ""
}
```