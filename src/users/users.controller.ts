import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import UserDTO from './user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly service: UsersService) {}

	@Post('/create')
	async createUser(@Body() dto: UserDTO) {
		return this.service.createUser(dto.username, dto.password);
	}

	@Get('/:username')
	async findOne(@Param('username') username: string) {
		return this.service.findOne(username);
	}
}
