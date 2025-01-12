import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import UserModel from './User.model';

@Entity({ name: 'token_version' })
export default class TokenVersionModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', default: 0 })
	tokenVersion: number;

	@Column()
	userId: number;

	@OneToOne(() => UserModel, (user) => user.tokenVersion, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user: UserModel;
}
