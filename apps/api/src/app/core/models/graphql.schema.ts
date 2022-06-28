
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Interest_And_Bio_And_Category_Input {
    text: string;
    color: string;
}

export class Signup_Input {
    email: string;
    password: string;
    birthDate: string;
}

export class Login_Input {
    email: string;
    password: string;
}

export class Send_Forgot_Password_Email_Input {
    email: string;
}

export class Find_User_Input {
    username?: Nullable<string>;
}

export class Confirm_Forgot_Password_Input {
    password: string;
    confirmPassword: string;
    auth: string;
}

export class GetStoryInput {
    id: string;
}

export class Create_Story_Input {
    category: Interest_And_Bio_And_Category_Input[];
}

export class Update_Story_Input {
    category?: Nullable<Nullable<Interest_And_Bio_And_Category_Input>[]>;
}

export class Delete_Story_Input {
    id: string;
}

export class Confirm_Delete_User_Input {
    confirmDeleteUser: boolean;
}

export class Update_User_Input {
    username?: Nullable<string>;
    fullName?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    gender?: Nullable<string>;
    birthDate?: Nullable<Date>;
    locale?: Nullable<string>;
    bio?: Nullable<Interest_And_Bio_And_Category_Input>;
    interests?: Nullable<Nullable<Interest_And_Bio_And_Category_Input>[]>;
}

export class Interest_And_Bio_And_Category {
    text: string;
    color: string;
}

export abstract class IQuery {
    abstract isAvailable(findUser: Find_User_Input): Is_User_Available | Promise<Is_User_Available>;

    abstract isAuthenticated(): Authentication_Status | Promise<Authentication_Status>;

    abstract logout(): Authentication_Status | Promise<Authentication_Status>;

    abstract getStory(story: GetStoryInput): Story | Promise<Story>;

    abstract getUser(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract signup(user: Signup_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract login(user: Login_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract sendForgotPasswordEmail(user: Send_Forgot_Password_Email_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract confirmForgotPassword(credentials: Confirm_Forgot_Password_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract createStory(story: Create_Story_Input, storyImage: Upload): Story | Promise<Story>;

    abstract updateStory(id: string, story: Update_Story_Input, storyImage?: Nullable<Upload>): Story | Promise<Story>;

    abstract deleteStory(story: Delete_Story_Input): Story_Status | Promise<Story_Status>;

    abstract updateUser(user?: Nullable<Update_User_Input>, profilePicture?: Nullable<Upload>, profileCover?: Nullable<Upload>): User | Promise<User>;

    abstract deleteUser(confirmDeleteUser: Confirm_Delete_User_Input): Authentication_Status | Promise<Authentication_Status>;
}

export class Is_User_Available {
    available: boolean;
}

export class Authentication_Status {
    status: string;
    authenticated?: Nullable<boolean>;
    userId?: Nullable<string>;
}

export class Story {
    id: string;
    storyImageUrl: string;
    category: Nullable<Interest_And_Bio_And_Category>[];
    createdAt: Date;
    userId: string;
}

export class Story_Status {
    status: string;
}

export class User {
    id: string;
    fullName?: Nullable<string>;
    username?: Nullable<string>;
    email: string;
    locale: string;
    profilePicture?: Nullable<string>;
    profileCover?: Nullable<string>;
    createdAt: Date;
    birthDate: string;
    gender: string;
    bio?: Nullable<Interest_And_Bio_And_Category>;
    interests: Nullable<Interest_And_Bio_And_Category>[];
}

export type Upload = any;
type Nullable<T> = T | null;
