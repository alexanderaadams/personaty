
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

export class ResetPasswordTokenInput {
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
    photo: string;
}

export class UpdateStoryInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    photo?: Nullable<string>;
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
}

export abstract class IQuery {
    abstract isAvailable(findUser: FindUserInput): AvailableReturn | Promise<AvailableReturn>;

    abstract logout(): StatusReturn | Promise<StatusReturn>;

    abstract getStory(story: GetStoryInput): StoryReturn | Promise<StoryReturn>;

    abstract getUser(id: string): UserReturn | Promise<UserReturn>;
}

export abstract class IMutation {
    abstract signup(user: SignupInput): StatusReturn | Promise<StatusReturn>;

    abstract login(user: LoginInput): StatusReturn | Promise<StatusReturn>;

    abstract forgotPassword(user: ForgotPasswordInput): StatusReturn | Promise<StatusReturn>;

    abstract resetPasswordToken(credentials: ResetPasswordTokenInput): StatusReturn | Promise<StatusReturn>;

    abstract createStory(story: CreateStoryInput): StoryReturn | Promise<StoryReturn>;

    abstract updateStory(id: string, story: UpdateStoryInput): StoryReturn | Promise<StoryReturn>;

    abstract deleteStory(story: DeleteStoryInput): DeleteStoryReturn | Promise<DeleteStoryReturn>;

    abstract updateUser(id: string, user: UpdateUserInput): UserReturn | Promise<UserReturn>;

    abstract deleteUser(id: string): StatusReturn | Promise<StatusReturn>;
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
}

export class AvailableReturn {
    available: boolean;
}

export class StatusReturn {
    status: string;
    authenticated?: Nullable<boolean>;
}

export class StoryReturn {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    photo?: Nullable<string>;
    createdAt?: Nullable<Date>;
    userId?: Nullable<string>;
}

export class DeleteStoryReturn {
    status: string;
}

export class UserReturn {
    _id?: Nullable<string>;
    fullName?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    locale?: Nullable<string>;
    profilePicture?: Nullable<string>;
    createdAt?: Nullable<Date>;
    birthDate?: Nullable<string>;
    gender?: Nullable<string>;
    role?: Nullable<string>;
    stories?: Nullable<Nullable<string>[]>;
}

type Nullable<T> = T | null;
