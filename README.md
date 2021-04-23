# discord-pinbot

Auth URL: https://discord.com/api/oauth2/authorize?client_id=834906079837290538&permissions=207936&scope=bot

## TODO:

- [x] Figure out a way to retain data per user
  - We need a backend API with database
    - [x] Or couldn't we use a file-based approach, skipping the need for a backend?
      - i.e. write JSON files on disk; IMO there will never be enough requests to overwhelm server's IO

- [x] Establish list of commands and syntax
  - (see list below)

- [ ] Plan & implement message pin feature
- [ ] Plan & implement search message pin feature
- [ ] Plan & implement message categorization feature
- [ ] Plan & implement message reminder feature

***

# Commands & Syntax

### UNLIMITED PIN MANAGEMENT

```
!pin          <message link> <keywords>
!unpin        <message link>
!searchpins   <keywords>
```

### PIN CATEGORIZATION

```
!categorize   <message link> <keywords>
!uncategorize <message link>
```

### PIN REMINDERS

```
!remindme     <message link> <delay> <message>
!forget       <message link>
```

### PARAMETERS

```
- <message link> are the one used when clicking "Copy Message Link"
- <keywords>     are just comma separated or a string of text
- <delay>        being either relative or fixed time:
                     - 5m, 1h, 2d or 2021-04-22 10:00AM
- <message>      is just a string of text
```