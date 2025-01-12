import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserModel from './database/models/User.model';
import MessageModel from './database/models/Message.model';
import GroupModel from './database/models/Group.model';
import TokenVersionModel from './database/models/TokenVersion.model';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'Azizaetl8.',
			database: 'messager',
			entities: [UserModel, MessageModel, GroupModel, TokenVersionModel],
			synchronize: true,
		}),
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
