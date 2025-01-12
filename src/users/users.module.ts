import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import UserModel from '../database/models/User.model';
import TokenVersionModel from 'src/database/models/TokenVersion.model';

@Module({
	imports: [TypeOrmModule.forFeature([UserModel, TokenVersionModel])],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
