import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserModel from './database/models/User.model';
import MessageModel from './database/models/Message.model';
import GroupModel from './database/models/Group.model';
import TokenVersionModel from './database/models/TokenVersion.model';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: 'messager',
			entities: [UserModel, MessageModel, GroupModel, TokenVersionModel],
			synchronize: true,
		}),
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
