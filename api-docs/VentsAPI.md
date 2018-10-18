## Register Vent

**URL** `/api/v1/vents/register`

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

Success responses will contain an HTTP status of 200 and return the registered vents id and status.

```
{
  "id": "da93b313-a8f8-4609-9e57-f7ca4b187ac1",
  "status": "registered"
}
```
