import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: 'hello',
			});

			// Check if token version matches current version
			const currentTokenVersion = await this.authService.getTokenVersion(
				payload.id,
			);
			if (currentTokenVersion !== payload.tokenVersion) {
				throw new UnauthorizedException('Token version mismatch');
			}

			// If token is valid and versions match, set the user without updating version
			request['user'] = payload;
			return true;
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				const payload = this.jwtService.decode(token) as any;

				if (
					!payload ||
					typeof payload !== 'object' ||
					!payload.id ||
					payload.tokenVersion == null
				) {
					throw new UnauthorizedException('Invalid payload');
				}

				const tokenVersion = parseInt(payload.tokenVersion, 10);
				if (isNaN(tokenVersion)) {
					throw new UnauthorizedException('Invalid token version');
				}

				// Verify the expired token's version matches current version
				const currentTokenVersion =
					await this.authService.getTokenVersion(payload.id);
				if (currentTokenVersion !== tokenVersion) {
					throw new UnauthorizedException('Token version mismatch');
				}

				try {
					// Update version only when token has expired
					await this.authService.updateTokenVersion(
						tokenVersion,
						payload.id,
					);

					const newPayload = {
						id: payload.id,
						username: payload.username,
						tokenVersion: tokenVersion + 1,
					};

					const newToken =
						await this.jwtService.signAsync(newPayload);
					request['user'] = newPayload;
					request['newToken'] = newToken;

					return true;
				} catch (error) {
					throw new UnauthorizedException(
						'Failed to update token version',
					);
				}
			}

			throw new UnauthorizedException();
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
