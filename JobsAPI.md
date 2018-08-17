## Add Job

**URL** `/api/v1/jobs`

**HTTP Method** POST

**Authentication** JWT as Authorization Bearer token

**Request Body** (example)

The mobile app will need to store this information locally upon registration of the vent.

```
{
  "name": "open",
  "data": {
    "id": "1dea4651-d230-4a46-8845-b8e0c436d8bf",
    "serial": "dev-vent",
    "code": "123456",
    "degrees": 180 // optional
  }
}
```

OR

```
[
  {
    "name": "open",
    "data": {
      "id": "1dea4651-d230-4a46-8845-b8e0c436d8bf",
      "serial": "dev-vent",
      "code": "123456",
      "degrees": 90 // optional
    }
  },
  {
    "name": "close",
    "data": {
      "id": "1dea4651-d230-4a46-8845-b8e0c436d8bf",
      "serial": "dev-vent",
      "code": "123456",
      "degrees": 90 // optional
    }
  }
]
```

**Responses**

Responses will be either 200/400. 400 will be returned if ALL jobs sent contained an error. 200 is returned if at least one of the jobs was successful. In both scenarios the object returned will contain the following arrays properties: `createdJobs` and `errors`. The objects within those arrays will contain an `idx` property that's a zero based ordered index of the jobs sent up by the clients request.

**Success Response**

Example of a completely successful request containing 2 jobs.

```
[{
  "createdJobs": [{
    "idx": 0,
    "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1"
  }, {
    "idx": 1,
    "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1"
  }],
  "errors": []
}]
```

**Error Responses**

Example of a request with only error(s).

```
[{
  "createdJobs": [],
  "errors": [{"idx": 0, "error": "SOME ERROR MESSAGE"}]
}]
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

## Process Jobs

**URL** `/api/v1/jobs/process`

**HTTP Method** POST

**Authentication** TBDev

**Request Body** (example)

The vent uses this endpoint to register that it's come online / been setup by the mobile app.

```
{
	"serial": "dev-vent",
	"code": "123456"
}
```

**Success Response**

Success responses will contain an HTTP status of 200 and return an array of jobs yet to processed for the vent. Still unsure of whether this job will be deleted prior to / right after returning the response.

```
[{
  "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1",
  "name": "open",
  "data": {
    "id": "1dea4651-d230-4a46-8845-b8e0c436d8bf",
    "serial": "dev-vent",
    "codeHash": "$2b$12$QDOOp3/8OTj7OqVbz2Bj.OpCLQ4DDVVeYBIVkujNm9sY7NkzX.PnK"
  }
  "createdAt": "2018-08-09T23:23:04.962Z"
}]
```
