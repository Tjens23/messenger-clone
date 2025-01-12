import {
	BaseEntity,
	Column,
	ManyToOne,
	PrimaryGeneratedColumn,
	Entity,
} from 'typeorm';
import UserModel from './User.model';

@Entity({ name: 'messages' })
export default class MessageModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => UserModel, (user) => user.messages)
	author: UserModel;
}
