import {
	Controller,
	Get,
	Param,
	UseGuards,
	UseInterceptors,
	Post,
	UploadedFile,
	Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { UserService } from './user.service';

import { TokenAuthGuard } from '../utils/guards/is-auth.guard';

import { Express } from 'express';
import { Multer } from 'multer';
import { saveImageToStorage } from './image-storage';
import { readFile } from 'fs';
import { join } from 'path';

@Controller('user')
@UseGuards(TokenAuthGuard)
// @Serialize(UserDto)
export class UserController {
	constructor(private usersService: UserService) {}

	@Post('upload/:id')
	@UseInterceptors(FileInterceptor('file', saveImageToStorage))
	async uploadImage(
		@UploadedFile() file: Express.Multer.File,
		@Param('id') id: string
	) {
		await this.usersService.uploadImage(file, id);
		return { status: "User's profile picture has been uploaded successfully" };
	}

	@Get('picture/:imageId')
	async getImage(@Param('imageId') imageId: string, @Res() res: Response) {
		// console.log(imageId);
		// const { profilePicture } =

		if (await this.usersService.getImage(imageId))
			return res.sendFile(imageId, { root: 'upload' });
	}

	// @Get(':id')
	// async findUser(@Param('id') id: string) {
	// 	return await this.usersService.findUserById(id);
	// }

	// @Get()
	// async findOne(@Query('email') email: string) {
	// 	return await this.usersService.findOne({ email });
	// }

	// @Patch(':id')
	// async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUser) {
	// 	return await this.usersService.updateUser(id, updateUser);
	// }

	// @Delete(':id')
	// async deleteUser(@Param('id') id: string) {
	// 	return await this.usersService.deleteUser(id);
	// }
}
