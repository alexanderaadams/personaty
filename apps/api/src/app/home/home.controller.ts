import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('home')
export class HomeController {

	@Post('post')
	post() {}

	@Get('posts')
	posts() {}

	@Get('user-info')
	userInfo() {}

	@Patch('update-post')
	updatePost() {}

	@Get('delete-post')
	deletePost() {}
}
