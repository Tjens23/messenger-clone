import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import MessageModel from './Message.model';
import GroupModel from './Group.model';
import TokenVersionModel from './TokenVersion.model';

@Entity({ name: 'users' })
export default class UserModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@OneToMany(() => MessageModel, (message) => message.author)
	messages: MessageModel[];

	@ManyToOne(() => GroupModel, (group) => group.groupName)
	group: GroupModel;

	@OneToOne(() => GroupModel, (group) => group.groupAdmin)
	groupAdmin: GroupModel;

	@OneToOne(() => TokenVersionModel, (tokenVersion) => tokenVersion.user)
	tokenVersion: TokenVersionModel;
}
