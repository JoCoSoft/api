## Add Job

**URL** `/api/v1/jobs`

**HTTP Method** POST

**Authentication** TBDev

**Request Body** (example)

The mobile app will need to store this information locally upon registration of the vent.

```
{
  "name": "open",
  "data": {
    "id": "1dea4651-d230-4a46-8845-b8e0c436d8bf",
    "serial": "dev-vent",
    "code": "123456"
  }
}
```

**Success Response**

Success responses will contain an HTTP status of 201 and return the newly created job.

```
{
  "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1"
}
```

**Error Response**

Error response will contain an HTTP status in the 400s / 500s and return a json document with an error property.

```
{
  "error": "SOME ERROR MESSAGE"
}
```

## Get Jobs

**URL** `/api/v1/jobs`

**HTTP Method** GET

**Authentication** TBDev

**Success Response**

Success responses will contain an HTTP status of 200 and return an array of jobs yet to be processed.

```
[{
  "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1",
  "name": "open",
  "createdAt": "2018-08-09T23:23:04.962Z"
}]
```
