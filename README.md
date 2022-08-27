# Cryptocurrency Price Alert APIs

<details open="open">
  <summary>Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project"> About the project </a>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
       <ul>
        <li><a href="#technologies-used">Technologies Used</a></li>
      </ul>
    </li>
    <li>
      <a href="#installation">Installation</a>
      <ul><a href="#requirements">Requirements</a></ul>
      <ul><a href="#how-to-start-the-server">How to start the server</a></ul>
    </li>
    <li><a href="#how-to-use">How To Use</a></li>
  </ol>
</details>

## About the project

Back-End APIs that handle creation, management, deletion of cryptocurrency’s price email-based alerts.

### Features

- User authentication at the endpoints using JWT tokens and BCrypt.
- A caching layer is present for the “fetch all alerts” endpoints which using Redis.
- When the price of the Crypto reaches the price specified by the user, an email will be send to user that set the alert at the price using SendGrid.
- It uses RabbitMQ as a message broker for the task to send emails.
- Paginated and filtered response of the “fetch all alerts” route.

### Technologies Used

- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Cloudamqp](https://www.cloudamqp.com/)
- [Cron](https://github.com/kelektiv/node-cron)
- [Express](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/)
- [NodeJS](https://nodejs.org/en/)
- [Redis](https://redis.io/)
- [SendGrid](https://sendgrid.com/)

## Installation

### Requirements

1. Install and run [MongoDB](https://www.mongodb.com/) locally.
2. Install and run [Redis](https://redis.io/) locally or use Redis as a service with Redis cloud.
3. Create an account on [Cloudamqp](https://www.cloudamqp.com/) to use RabbitMQ as a service.
4. Create an account on [SendGrid](https://sendgrid.com/).

### How to start the server

1. Clone this repository on your local machine.
2. Install all the dependencies using node package manager.
3. Create a `.env` file in the root directory and store the following information in this file:
   _ SendGrid API key and user email address
   _ If MongoDB Atlas is used then store the URL else connect to the MongoDB local host
   _ If Redis is used as a service then store the URL else connect to the local host
   _ Store the URL of Cloudamqp \* Access and Refresh tokens for JSON web token
   These variables should be specified as

```
DB_URL=<mongodbURL>
ACCESS_TOKEN_SECRET=<accesToken>
REFRESH_TOKEN_SECRET=<refreshToken>
SendGrid=<apiKey>
SendGridFrom=<userEmail>
AmqpURL=<cloudURL>
RedisURL=<redisURL>
```

4. Run the following commands in different terminals to start the server:

```
node server.js
```

```
node workers/sendAlert.js
```

```
node utilities/consumer.js
```

## How To Use

- **Registration**
  - Send a post request to `http://localhost:3000/users/register` with request body containing JSON object with the name, email, and password key of the user.
- **LogIn**
  - Send a post request to `http://localhost:3000/users/login` with request body containing JSON object with the email and password key of the user.
  - In response, the user will receive the access and refresh tokens.
  - Also, the access token will be expired after 30 minutes, therefore, to get a new access token, the user should send a post request to `http://localhost:3000/users/token` with request body containing JSON object with the refresh token received at the time of login.
- **Creating Alerts**
  - Send a post request to `http://localhost:3000/alerts/create` with query parameter price set to the price at which user wants to get an alert.
  - Also, access token received at the login route must be added as the Authorization Bearer type token.
- **Fetching all Alerts**
  - Send a get request to `http://localhost:3000/alerts` with query parameter page set to the value of the page of which the user wants to get alerts.
  - Also, access token received at the login route must be added as the Authorization Bearer type token.
  - Additionally, user can also add a status query parameter to filter alerts based on their status of "Created", "Triggered", and "Deleted".
  - The response will contain alerts with the alert ID, status, price, and user email ID information.
- **Deleting Alerts**
  - Send a delete request to `http://localhost:3000/alerts/delete` with query parameter id having the value set to the ID of the alert.
  - Also, access token received at the login route must be added as the Authorization Bearer type token.
- **LogOut**
  - Send a delete request to `http://localhost:3000/users/logout` with request body containing JSON object with the email of the user.
