import {
	Body,
	Controller,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	UseGuards,
	UseInterceptors,
	Post,
	Req,
	UploadedFile,
	Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { UserService } from './user.service';

import { AuthGuard } from '../utils/guards/is-auth.guard';
import { UpdateUser } from '../core/shared.model';
import { Express } from 'express';
import { Multer } from 'multer';
// import { saveImageToStorage } from './image-storage';
import { of, switchMap } from 'rxjs';
import { join } from 'path';
// import { Serialize } from './interceptors/serialize.interceptor';

@Controller('user')
@UseGuards(AuthGuard)
// @Serialize(UserDto)
export class UserController {
	constructor(private usersService: UserService) {}

	@Post('upload/:id')
	// @UseInterceptors(FileInterceptor('file', saveImageToStorage))
	async uploadImage(
		@UploadedFile() file: Express.Multer.File,
		@Param('id') id: string
	) {
		// return this.usersService.uploadImage(file, id);
	}

	@Get('image/:id')
	async getImage(@Param('id') id: string, @Res() res: Response) {
		const user = await this.usersService.findUserById(id);
		return await res.sendFile(user.profilePicture, { root: 'upload' });
	}

	@Get(':id')
	async findUser(@Param('id') id: string) {
		return await this.usersService.findUserById(id);
	}

	@Get()
	async findOne(@Query('email') email: string) {
		return await this.usersService.findOne({ email });
	}

	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() body: UpdateUser) {
		return await this.usersService.updateUser(id, body);
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		return await this.usersService.deleteUser(id);
	}
}
