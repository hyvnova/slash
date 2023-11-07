export type UserData = {
    username: string;
    password: string; // Hashed password
    token: string;
    avatar: string;
    verified: boolean;
}

// Public data
export type ProfileData = {
    username: string;
    avatar: string;
}
