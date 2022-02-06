import {
	Body,
	Controller,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	UseGuards,
	Req,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { UpdateUser, UserModel } from './users.model';

import { GetCurrentUserById } from '../utils/get-user-by-id.decorator';
import { AdminGuard } from '../utils/guards/is-admin.guard';
// import { Serialize } from './interceptors/serialize.interceptor';

@Controller('user')
@UseGuards(AdminGuard)
// @Serialize(UserDto)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('whoami')
	whoAmI(@GetCurrentUserById() user: UserModel) {
		return this.usersService.findUser(user.id);
	}

	@Get('getallusers')
	findAllUsers(@Req() req: Request) {
		// console.log(req?.headers.host);
		return this.usersService.findAllUsers();
	}

	@Get(':id')
	findUser(@Param('id') id: string) {
		return this.usersService.findUser(id);
	}

	@Get()
	findOne(@Query('email') email: string) {
		return this.usersService.findOne({ email });
	}

	@Patch(':id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUser) {
		return this.usersService.updateUser(id, body);
	}

	@Delete('deleteallusers')
	deleteAllUsers() {
		return this.usersService.deleteAllUsers();
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.usersService.deleteUser(id);
	}
}
