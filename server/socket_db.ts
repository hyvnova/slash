import { Status } from "./types.js";

interface User {
  [x: string]: string;
  socketId: string;
  status: Status; 

}


const onlineUsers = new Map<string, User>();

/**
 * Create a user online record
 * @param username 
 */
export function create_user(socketId: string, username: string) {
  onlineUsers.set(username, {
    socketId: socketId,
    status: Status.OFFLINE
  });

    return onlineUsers.get(username) as User;
}

/** 
 * Check if user exists
 * @param username 
 */
export function exists(username: string): boolean {
  return onlineUsers.has(username);
}

/**
 * Get user status  
 * @param username 
 * @returns status or "offline" if doesn't exist
 */
export function get_status(username: string): Status {
  let user = onlineUsers.get(username);
  if (!user) {
    // Don't know how you can reach this point, but just in case
    return Status.OFFLINE;
  }
  return user?.status ?? Status.OFFLINE
}

/** 
 * Set user status
 * @param username
 * @param status 
 */
export function set_status(username: string, status: Status) {
    let user = onlineUsers.get(username);
    if (!user) {
        // Another case where you shouldn't reach this point
        return;
    }
    onlineUsers.set(username, {
        socketId: user.socketId,
        status
    });
}

/**
 * Log user connection 
 * @param socketId  
 * @param username
 */ 
export function connect(socketId: string, username: string) {
    onlineUsers.set(username, {
        socketId,
        status: Status.ONLINE
    });
}   

/**
 * Log user disconnection
 * @param socketId 
 */
export function disconnect(username: string) {
    onlineUsers.set(username, {
        socketId: "",
        status: Status.OFFLINE
    });
}

/**
 * Check if user is online
 * @param username
 * @returns true if online, false otherwise
 */
export function is_online(username: string): boolean {
    return get_status(username) === Status.ONLINE;
}

/**
 * Get username
 * @param socketId
 * @returns username or null if doesn't exist
 */
export function get_username(socketId: string): string | null {
    onlineUsers.forEach((user, username) => {
        if (user.socketId === socketId) {
            return username;
        }
    });
    return null;
}

/**
 * Get online users from a list of usernames
 * @param usernames
 * @returns online users
 */
export function get_online_from(usernames: string[]){
    let online: User[] = [];
    for (const username of usernames) {
        if (is_online(username)) {
            let user = onlineUsers.get(username);

            if (!user) {
                // Another case where you shouldn't reach this point
                continue;
            }

            user.username = username;
            online.push(user);
        }
    }
    return online;
}