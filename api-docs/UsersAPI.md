## User Sign Up

**URL** `/api/v1/users/sign-up`

**HTTP Method** POST

**Request Body**

The client uses this endpoint to sign up users in the system. Each of these properties is required and the `password` and `confirmPassword`
properties must match.

```
{
	"name": "Ludwig Heinrich Edler von Mises",
	"email": "mises@univie.ac.at",
	"password": "classical liberalism",
	"confirmPassword": "classical liberalism"
}
```

**Success Response**

Success responses will contain an HTTP status of 201 and return the newly signed up user.

```
{
    "id": "1478a181-9d70-4fa9-bfe6-ad71a3db67a8",
    "email": "mises@univie.ac.at",
    "name": "Ludwig Heinrich Edler von Mises"
}
```

**Error Responses**

Error responses will contain an HTTP status of 400 and return a JSON object with an `errors` property, which is an array of objects. Each object within the `errors` array will have a `name`
property of type `string` and an `error` property of type `string`.

The following is an example response in the case of someone attempting to sign up with an email we already have in the database.

```
{
    "errors": [
        {
            "name": "Email",
            "error": "A user with that email already exists. Try signing in."
        }
    ]
}
```

## User Sign In

**URL** `/api/v1/users/sign-in`

**HTTP Method** POST

**Request Body**

The client uses this endpoint to authenticate users in the system. Each of these properties is required.

```
{
	"name": "Ludwig Heinrich Edler von Mises",
	"email": "mises@univie.ac.at",
	"password": "classical liberalism"
}
```

**Success Response**
Success responses will contain an HTTP status of 200 and return the newly signed up user and an auth token to be used as a `Bearer` token for
requests that require authentication via an `Authorization` header.

```
{
    "user": {
        "id": "b6c7b41a-9686-4aad-8207-429b9f2724a7",
        "email": "eddiehedges@gmail.com",
        "name": "Eddie Hedges",
        "createdAt": "2018-10-18T07:12:44.605Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2YzdiNDFhLTk2ODYtNGFhZC04MjA3LTQyOWI5ZjI3MjRhNyIsImVtYWlsIjoiZWRkaWVoZWRnZXNAZ21haWwuY29tIiwibmFtZSI6IkVkZGllIEhlZGdlcyIsImNyZWF0ZWRBdCI6IjIwMTgtMTAtMThUMDc6MTI6NDQuNjA1WiIsImlhdCI6MTUzOTgyOTE2NH0.HqzLIaiN-FcZG907cxvElaIJiQpEGOn1w5scpNhBYl8"
}
```

**Error Response**
Error responses will return an HTTP status of 400 that looks something like the following.

```
{
    "message": "Authentication error",
    "user": null
}
```
