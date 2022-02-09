import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from './is-admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
	constructor(private adminService: AdminService) {}
	@Get('getallusers')
	async findAllUsers() {
		return await this.adminService.findAllUsers();
	}
	@Delete('deleteallusers')
	async deleteAllUsers() {
		return await this.adminService.deleteAllUsers();
	}
}
