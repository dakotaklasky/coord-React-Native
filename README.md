# coord - Design your own dating app

## Introduction

Coord is a highly customizable dating app where users can match based on preference filtering.


## Setup

Enter into venv
```console
$ pipenv install & pipenv shell
```
Configure Flask
```console
$ export FLASK_APP=app.py
$ export FLASK_RUN_PORT=5555
$ export SECRET_KEY=your_secret_key
```
Generate and seed database
```console
$ flask db init
$ flask db upgrade
$ cd server
$ python seed.py
```
Start Flask server
```console
$ cd server
$ python app.py
```
Start React server
```console
$ cd client
$ npm install
$ npm start
```


## Description

### Home
Display matches based on user preferences. Use ❌ and ❤️ buttons to send likes or dislikes.
User will be notified if there's a match.

### My Matches
List of current matches. See user profile by clicking link.

### My Account
- View Profile
  - See preview of what other users see.

- Edit Profile
  - Update your personal information.

- Edit Preferences
  - Update your preferences for other users.

### Login
Enter a valid username.

### Sign Up
Enter a new username. All other information is optional.

### Logout
Logout current user.