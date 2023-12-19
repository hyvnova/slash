const onlineUsers = new Map();
/**
 * Create a user online record
 * @param username
 */
export function create_user(username) {
    onlineUsers.set(username, {
        socketId: "",
        status: "offline" /* Status.OFFLINE */
    });
    return onlineUsers.get(username);
}
/**
 * Check if user exists
 * @param username
 */
export function exists(username) {
    return onlineUsers.has(username);
}
/**
 * Get user status
 * @param username
 * @returns status or "offline" if doesn't exist
 */
export function get_status(username) {
    const user = onlineUsers.get(username);
    if (!user) {
        create_user(username);
    }
    return user?.status ?? "offline" /* Status.OFFLINE */;
}
/**
 * Set user status
 * @param username
 * @param status
 */
export function set_status(username, status) {
    let user = onlineUsers.get(username);
    if (!user) {
        user = create_user(username);
    }
    user.status = status;
}
/**
 * Log user connection
 * @param socketId
 * @param username
 */
export function connect(socketId, username) {
    let user = onlineUsers.get(username);
    if (!user) {
        user = create_user(username);
    }
    user.socketId = socketId;
    user.status = "online" /* Status.ONLINE */;
}
/**
 * Log user disconnection
 * @param socketId
 */
export function disconnect(username) {
    const user = onlineUsers.get(username);
    if (!user) {
        return;
    }
    user.status = "offline" /* Status.OFFLINE */;
    user.socketId = "";
}
/**
 * Check if user is online
 * @param username
 * @returns true if online, false otherwise
 */
export function is_online(username) {
    return get_status(username) === "online";
}
/**
 * Get username
 * @param socketId
 * @returns username or null if doesn't exist
 */
export function get_username(socketId) {
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
export function get_online_from(usernames) {
    let online = [];
    for (const username of usernames) {
        if (is_online(username)) {
            let user = onlineUsers.get(username);
            if (!user) {
                user = create_user(username);
            }
            user.username = username;
            online.push(onlineUsers.get(username));
        }
    }
    return online;
}
