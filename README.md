# discord-pinbot

Auth URL: https://discord.com/api/oauth2/authorize?client_id=834906079837290538&permissions=207936&scope=bot

## TODO:

- [x] Figure out a way to retain data per user
  - We need a backend API with database
    - [x] Or couldn't we use a file-based approach, skipping the need for a backend?
      - i.e. write JSON files on disk; IMO there will never be enough requests to overwhelm server's IO

- [x] Establish list of commands and syntax
  - (see list below)

- [x] Find an universal way of making data reusable
  - (having as less redundancy as possible)
  - i.e. KEY: userid_messageurl = keywords
    - would make it easy to find line based on `userid` or `messageurl` or `keywords`
      - [ ] Find a similar structure for reminders

- [x] Plan & implement message pin feature
  - [x] Per-user Pins
  - [x] Common Pins

- [x] Plan & implement search message pin feature

- [ ] Plan & implement message reminder feature
  - See this as an objective for Reminders integration: https://tmp.f8.n0.cdn.getcloudapp.com/items/YEuRDk58/38db674c-f80e-40b4-a32a-cfa57701324f.png?v=c9d4e732ebff500e9dc047084542971a

- Idea: !translate <from_language> <to_language> <message>
- Idea: curfew (beep at 3am (recurring reminders?))
- Idea: Integrate other bot's feature (pomodoro, groovy, etc)

***

# Commands & Syntax

### Pin Management

```
!pin          <message link> <keywords> (redundant with `!categorize`?)
!unpin        <message link>
!searchpins   <keywords>
```

### Per-User Pin Management

```
!userpin          <message link> <keywords> (redundant with `!categorize`?)
!userunpin        <message link>
!usersearchpins   <keywords>
```

### Message Reminders

```
!remindme     <message link> <delay> <message>
!forget       <message link>
```

### Parameters

```
- <message link> are the one used when clicking "Copy Message Link"
- <keywords>     are just comma separated or a string of text
- <delay>        being either relative or fixed time:
                     - 5m, 1h, 2d or 2021-04-22 10:00AM
- <message>      is just a string of text
```