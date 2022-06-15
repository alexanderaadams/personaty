
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

export class CreateStoryInput {
    category: Interest_And_Bio_And_Category_Input[];
}

export class UpdateStoryInput {
    category?: Nullable<Nullable<Interest_And_Bio_And_Category_Input>[]>;
}

export class DeleteStoryInput {
    id: string;
}

export class UpdateUserInput {
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

    abstract createStory(story: CreateStoryInput, storyImage: Upload): Story | Promise<Story>;

    abstract updateStory(id: string, story: UpdateStoryInput, storyImage?: Nullable<Upload>): Story | Promise<Story>;

    abstract deleteStory(story: DeleteStoryInput): Story_Status | Promise<Story_Status>;

    abstract updateUser(user: UpdateUserInput, profilePicture?: Nullable<Upload>): User | Promise<User>;

    abstract deleteUser(): User_Status | Promise<User_Status>;
}

export class Is_User_Available {
    available: boolean;
}

export class Authentication_Status {
    status: string;
    authenticated?: Nullable<boolean>;
}

export class Story {
    _id: string;
    story_image_url: string;
    category: Nullable<Interest_And_Bio_And_Category>[];
    created_at: Date;
    user_id: string;
}

export class Story_Status {
    status: string;
}

export class User {
    _id: string;
    fullName?: Nullable<string>;
    username?: Nullable<string>;
    email: string;
    locale: string;
    profilePicture?: Nullable<string>;
    created_at: Date;
    birthDate: string;
    gender: string;
    role: string;
    stories: Nullable<Story>[];
    bio: Interest_And_Bio_And_Category;
    interests: Nullable<Interest_And_Bio_And_Category>[];
}

export class User_Status {
    status: string;
}

export type Upload = any;
type Nullable<T> = T | null;
