// import { UserModel } from '@features/user/models/user/user.model';
// import { UseGuards } from '@nestjs/common';
// import { Args, ID, Query, Resolver } from '@nestjs/graphql';
// import { TokenAuthGuard } from '../../core/guards/is-auth.guard';
// import { ImageService } from './image.service';

// @Resolver('Image')
// @UseGuards(TokenAuthGuard)
// export class ImageResolver {
// 	constructor(private readonly imageService: ImageService) {}

// 	@Query('getPicture')
// 	async getPicture(
// 		@Args('userId', { type: () => ID }) userId: string,
// 		@Args('pictureName', { type: () => String }) pictureName: string
// 	): Promise<any | null> {
// 		const picture = await this.imageService.getImage(
// 			'62b35beebbf0ceaddbdcdedb',
// 			pictureName + '.jpeg'
// 		);
// 		console.log(pictureName, picture, typeof picture);
// 		return picture;
// 	}
// }
