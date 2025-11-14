import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ default: true })
    isActive: boolean;
}

