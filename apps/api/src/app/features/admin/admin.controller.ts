import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from './is-admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Get('get-all-users')
	findAllUsers() {
		return this.adminService.findAllUsers();
	}

	@Delete('delete-all-users')
	deleteAllUsers() {
		return this.adminService.deleteAllUsers();
	}
}
