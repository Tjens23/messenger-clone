import { IsNotEmpty, IsString } from 'class-validator';

export default class UserDTO {
	@IsString()
	@IsNotEmpty()
	username: string;
	@IsString()
	@IsNotEmpty()
	password: string;
}
