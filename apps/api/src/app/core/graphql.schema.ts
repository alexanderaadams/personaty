
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
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
    token: string;
}

export class Test_Mutate_Input {
    name: string;
}

export class GetStoryInput {
    id: string;
}

export class CreateStoryInput {
    category: CategoryInput[];
}

export class UpdateStoryInput {
    category?: Nullable<Nullable<CategoryInput>[]>;
}

export class DeleteStoryInput {
    id: string;
}

export class CategoryInput {
    text: string;
    color: string;
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
    bio?: Nullable<Interest_And_Bio_Input>;
    interests?: Nullable<Nullable<Interest_And_Bio_Input>[]>;
}

export class Interest_And_Bio_Input {
    text: string;
    color: string;
}

export abstract class IQuery {
    abstract isAvailable(findUser: Find_User_Input): Is_User_Available | Promise<Is_User_Available>;

    abstract isAuthenticated(): Authentication_Status | Promise<Authentication_Status>;

    abstract logout(): Authentication_Status | Promise<Authentication_Status>;

    abstract getImage(Image_Url: string): Nullable<Image_Url> | Promise<Nullable<Image_Url>>;

    abstract getStory(story: GetStoryInput): Story | Promise<Story>;

    abstract getUser(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract signup(user: Signup_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract login(user: Login_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract sendForgotPasswordEmail(user: Send_Forgot_Password_Email_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract confirmForgotPassword(credentials: Confirm_Forgot_Password_Input): Authentication_Status | Promise<Authentication_Status>;

    abstract addProfilePicture(picture: Upload): Nullable<Image_Url> | Promise<Nullable<Image_Url>>;

    abstract testMut(picture: Test_Mutate_Input): Nullable<Image_Url> | Promise<Nullable<Image_Url>>;

    abstract createStory(story: CreateStoryInput, storyImage: Upload): Story | Promise<Story>;

    abstract updateStory(id: string, story: UpdateStoryInput): Story | Promise<Story>;

    abstract deleteStory(story: DeleteStoryInput): Story_Status | Promise<Story_Status>;

    abstract updateUser(id: string, user: UpdateUserInput): User | Promise<User>;

    abstract deleteUser(id: string): User_Status | Promise<User_Status>;
}

export class User {
    _id: string;
    username?: Nullable<string>;
    email: string;
    locale?: Nullable<string>;
    profilePicture?: Nullable<string>;
    birthDate: string;
    gender?: Nullable<string>;
    createdAt?: Nullable<Date>;
    fullName?: Nullable<string>;
    created_at: Date;
    role?: Nullable<string>;
    stories: Nullable<Story>[];
    bio: Interest_And_Bio;
    interests: Nullable<Interest_And_Bio>[];
}

export class Is_User_Available {
    available: boolean;
}

export class Authentication_Status {
    status: string;
    authenticated?: Nullable<boolean>;
}

export class File_Information {
    status?: Nullable<string>;
}

export class File {
    filename: string;
    mimetype: string;
    encoding: string;
}

export class Image_Url {
    imageUrl: string;
}

export class Story {
    _id: string;
    storyImageUrl: string;
    category: Nullable<Category>[];
    created_at: Date;
    user_id: string;
    title?: Nullable<string>;
    description?: Nullable<string>;
    photo?: Nullable<string>;
}

export class Story_Status {
    status: string;
}

export class Category {
    text: string;
    color: string;
}

export class User_Status {
    status: string;
}

export class Interest_And_Bio {
    text: string;
    color: string;
}

export type Upload = any;
type Nullable<T> = T | null;
