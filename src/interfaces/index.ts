export interface IUser {
    socketId: string,
    username: string,
    room: string,
    bio: string,
    isOnline: boolean,
}

export interface IMessage extends Omit<IUser, "socketId"> {
    content: string,
    createdAt: string,
}