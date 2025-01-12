import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import TokenVersionModel from 'src/database/models/TokenVersion.model';

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [
		UsersModule,
		JwtModule.register({
			secret: 'hello',
			global: true,
			signOptions: { expiresIn: '10s' },
		}),
		TypeOrmModule.forFeature([TokenVersionModel]),
	],
})
export class AuthModule {}
