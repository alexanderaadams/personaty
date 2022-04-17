
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class SignupInput {
    email: string;
    password: string;
    birthDate: string;
}

export class LoginInput {
    email: string;
    password: string;
}

export class ForgotPasswordInput {
    email: string;
}

export class FindUserInput {
    id?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
}

export class Confirm_Forgot_Password_With_JWT_Input {
    password: string;
    confirmPassword: string;
    token: string;
}

export class GetStoryInput {
    id: string;
}

export class CreateStoryInput {
    title: string;
    description: string;
    category: string[];
    user_id: string;
}

export class UpdateStoryInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    category?: Nullable<Nullable<string>[]>;
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
    profilePicture?: Nullable<string>;
    bio?: Nullable<string>;
    tags?: Nullable<Nullable<string>[]>;
}

export abstract class IQuery {
    abstract isAvailable(findUser: FindUserInput): Is_User_Available | Promise<Is_User_Available>;

    abstract isAuthenticated(): Authentication_Status | Promise<Authentication_Status>;

    abstract logout(): Authentication_Status | Promise<Authentication_Status>;

    abstract getStory(story: GetStoryInput): Story | Promise<Story>;

    abstract getUser(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract signup(user: SignupInput): Authentication_Status | Promise<Authentication_Status>;

    abstract login(user: LoginInput): Authentication_Status | Promise<Authentication_Status>;

    abstract forgotPassword(user: ForgotPasswordInput): Authentication_Status | Promise<Authentication_Status>;

    abstract resetPasswordToken(credentials: Confirm_Forgot_Password_With_JWT_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract createStory(story: CreateStoryInput): Story | Promise<Story>;

    abstract updateStory(id: string, story: UpdateStoryInput): Story | Promise<Story>;

    abstract deleteStory(story: DeleteStoryInput): Story_Status | Promise<Story_Status>;

    abstract updateUser(id: string, user: UpdateUserInput): User | Promise<User>;

    abstract deleteUser(id: string): User_Status | Promise<User_Status>;
}

export class User {
    _id?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    locale?: Nullable<string>;
    profilePicture?: Nullable<string>;
    birthDate?: Nullable<string>;
    gender?: Nullable<string>;
    createdAt?: Nullable<Date>;
    fullName?: Nullable<string>;
    created_at?: Nullable<Date>;
    role?: Nullable<string>;
    stories: Nullable<Story>[];
    bio?: Nullable<string>;
    tags?: Nullable<Nullable<string>[]>;
}

export class Is_User_Available {
    available: boolean;
}

export class Authentication_Status {
    status: string;
    authenticated?: Nullable<boolean>;
}

export class Story {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    category?: Nullable<Nullable<string>[]>;
    created_at?: Nullable<Date>;
    user_id?: Nullable<string>;
    photo?: Nullable<string>;
}

export class Story_Status {
    status: string;
}

export class User_Status {
    status: string;
}

type Nullable<T> = T | null;
