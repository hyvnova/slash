export type UserData = {
    username: string;
    password: string; // Hashed password
    token: string;
    avatar: string;
    verified: boolean;
    friends: string[];
}
