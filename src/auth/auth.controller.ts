import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Login.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@Post('login')
	async signIn(@Body() loginDto: LoginDto, @Res() response: Response) {
		const token = await this.service.signIn(
			loginDto.username,
			loginDto.password,
		);
		response.setHeader('Authorization', `Bearer ${token}`);
		return response
			.status(200)
			.json({ message: `Hello ${loginDto.username}` });
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@UseGuards(AuthGuard)
	@Post('logout')
	async logout(@Res() response: Response) {
		return response.status(200).json({ message: 'Logged out' });
	}
}
