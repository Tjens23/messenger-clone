import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import TokenVersionModel from 'src/database/models/TokenVersion.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		private readonly service: UsersService,
		private readonly jwtService: JwtService,
		@InjectRepository(TokenVersionModel)
		private readonly tokenVersion: Repository<TokenVersionModel>,
	) {}

	async signIn(username: string, pass: string): Promise<any> {
		const user = await this.service.findOne(username);
		if (!user) {
			throw new UnauthorizedException('User not found!');
		}

		const validPassword = await compare(pass, user.password);
		if (!validPassword) {
			throw new UnauthorizedException('Invalid credentials!');
		}

		const tokenVersion = await this.getTokenVersion(user.id);

		const payload = {
			id: user.id,
			username: user.username,
			tokenVersion,
		};

		return await this.jwtService.signAsync(payload);
	}

	async updateTokenVersion(currentVersion: number, userId: number) {
		if (!Number.isInteger(userId)) {
			throw new Error('Invalid userId provided');
		}

		const tokenVersion = await this.tokenVersion.findOne({
			where: { userId: userId },
		});

		if (!tokenVersion) {
			throw new Error('Token version not found!');
		}

		// Verify the current version matches before updating
		if (tokenVersion.tokenVersion !== currentVersion) {
			throw new UnauthorizedException('Token version mismatch');
		}

		tokenVersion.tokenVersion += 1;
		await this.tokenVersion.save(tokenVersion);

		return tokenVersion;
	}

	async getTokenID(userId: number) {
		return this.tokenVersion.findOne({
			select: ['id'],
			where: { userId },
		});
	}

	async getTokenVersion(userId: number): Promise<number> {
		const result = await this.tokenVersion.findOne({
			select: ['tokenVersion'],
			where: { userId },
		});
		return result?.tokenVersion ?? 0;
	}
}
