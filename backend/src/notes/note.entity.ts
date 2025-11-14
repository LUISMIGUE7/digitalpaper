import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tag } from '../tags/tag.entity';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ default: false })
    archived: boolean;

    @ManyToMany(() => Tag, tag => tag.notes, { cascade: true, eager: true })
    @JoinTable({
        name: 'note_tags',
        joinColumn: { name: 'note_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
    })
    tags: Tag[];
}
