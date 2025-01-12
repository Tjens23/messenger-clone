import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserModel from '../database/models/User.model';
import { hash } from 'bcrypt';
import TokenVersionModel from '../database/models/TokenVersion.model';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserModel)
		private readonly userRepository: Repository<UserModel>,
		@InjectRepository(TokenVersionModel)
		private readonly tokenVersionRepository: Repository<TokenVersionModel>,
	) {}

	async findOne(username: string): Promise<UserModel | null> {
		return this.userRepository.findOne({ where: { username } });
	}

	async createUser(username: string, password: string): Promise<UserModel> {
		try {
			// Hash the password
			const hashedPassword = await hash(password, 10);

			// Create and save user
			const newUser = this.userRepository.create({
				username,
				password: hashedPassword,
			});
			await this.userRepository.save(newUser);

			// Create and save token version
			const newTokenVersion = this.tokenVersionRepository.create({
				userId: newUser.id,
				tokenVersion: 1,
			});
			await this.tokenVersionRepository.save(newTokenVersion);

			// Return user with relations
			return this.userRepository.findOne({
				where: { id: newUser.id },
				relations: ['tokenVersion'],
			});
		} catch (err) {
			throw new InternalServerErrorException(
				`Failed to create user: ${err.message}`,
			);
		}
	}
}
