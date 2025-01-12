import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import UserModel from './User.model';

@Entity({ name: 'groups' })
export default class GroupModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	groupName: string;

	@OneToMany(() => UserModel, (user) => user.group)
	members: UserModel[];

	@OneToOne(() => UserModel, (user) => user.groupAdmin)
	@JoinColumn()
	groupAdmin: UserModel;
}
