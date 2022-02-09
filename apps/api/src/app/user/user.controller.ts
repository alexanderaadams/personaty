import {
	Body,
	Controller,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';

import { AdminGuard } from '../utils/guards/is-admin.guard';
import { UpdateUser } from '../core/shared.model';
// import { Serialize } from './interceptors/serialize.interceptor';

@Controller('user')
@UseGuards(AdminGuard)
// @Serialize(UserDto)
export class UserController {
	constructor(private usersService: UserService) {}

	@Get('getallusers')
	async findAllUsers() {
		return await this.usersService.findAllUsers();
	}

	@Get(':id')
	async findUser(@Param('id') id: string) {
		return await this.usersService.findOne({ id: id });
	}

	@Get()
	async findOne(@Query('email') email: string) {
		return await this.usersService.findOne({ email });
	}

	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() body: UpdateUser) {
		return await this.usersService.updateUser(id, body);
	}

	@Delete('deleteallusers')
	async deleteAllUsers() {
		return await this.usersService.deleteAllUsers();
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		return await this.usersService.deleteUser(id);
	}
}
