# How it works
This file defines the general schema of how sockets work server-client


## Status
When going online, offline
This will be sent to all friends of the user.
`StatysType: 'online' | 'offline'`

| Action      | Event Name           | Data                              |
| ----------- | -------------------- | --------------------------------- |
| online      | status               | status: StatusType, friends: string[]|


## Friend requests
When a friend request is: sent, cancel, accepted, rejected

| Action      | Event Name            | Data                              |
| ----------- | --------------------- | --------------------------------- |
| send        | new friend request    | other_username   |             
| cancel      | cancel friend request | other_username   |
| accept      | accept friend request | other_username   |
| reject      | reject friend request | other_username   |

## Friendships
When a friendship is: created, deleted
| Action      | Event Name            | Data                              |
| ----------- | --------------------- | --------------------------------- |
| create      | accept friend request | other_username   |
| delete      | unfriend              | other_username   |