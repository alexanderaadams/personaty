import { Controller, UseGuards } from '@nestjs/common';

import { TokenAuthGuard } from '@core/guards/is-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(TokenAuthGuard)
// @Serialize(UserDto)
export class UserController {
	constructor(private usersService: UserService) {}

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