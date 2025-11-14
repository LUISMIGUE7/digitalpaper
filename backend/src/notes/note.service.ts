import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note) private noteRepo: Repository<Note>,
        @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    ) { }

    async findAll(): Promise<Note[]> {
        return this.noteRepo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: number): Promise<Note> {
        const note = await this.noteRepo.findOne({ where: { id } });
        if (!note) throw new NotFoundException(`Nota con id ${id} no encontrada`);
        return note;
    }

    async create(noteData: Partial<Note>): Promise<Note> {
        const tags = await Promise.all(
            (noteData.tags || []).map(async (t) => {
                let tag = await this.tagRepo.findOne({ where: { name: t.name } });
                if (!tag) {
                    tag = this.tagRepo.create({ name: t.name });
                    await this.tagRepo.save(tag);
                }
                return tag;
            }),
        );
        const note = this.noteRepo.create({ ...noteData, tags });
        return this.noteRepo.save(note);
    }

    async update(id: number, updateData: any): Promise<Note> {
        const note = await this.noteRepo.findOne({
            where: { id },
            relations: ['tags']
        });

        if (!note) {
            throw new Error('Nota no encontrada');
        }

        // Actualizar campos simples
        note.title = updateData.title ?? note.title;
        note.content = updateData.content ?? note.content;
        note.archived = updateData.archived ?? note.archived;

        // Actualizar tags (many-to-many)
        if (updateData.tags) {

            const tags = await Promise.all(
                updateData.tags.map(async (t: any) => {
                    let tag = await this.tagRepo.findOne({ where: { name: t.name } });
                    if (!tag) {
                        tag = this.tagRepo.create({ name: t.name });
                        await this.tagRepo.save(tag);
                    }
                    return tag;
                })
            );
            note.tags = tags;
        }

        return this.noteRepo.save(note);
    }

    async remove(id: number): Promise<void> {
        await this.noteRepo.delete(id);
    }

    // listar notas activas o archivadas
    async findByArchived(archived: boolean): Promise<Note[]> {
        return this.noteRepo.find({
            where: { archived },
            order: { createdAt: 'DESC' },
        });
    }

    //  filtrar notas por categoría/tag
    async findByTag(tagName: string): Promise<Note[]> {
        return this.noteRepo
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.tags', 'tag')
            .where('tag.name = :tagName', { tagName })
            .orderBy('note.createdAt', 'DESC')
            .getMany();
    }

    // filtrar notas por archived y tag simultáneamente
    async findByArchivedAndTag(archived: boolean, tagName: string): Promise<Note[]> {
        return this.noteRepo
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.tags', 'tag')
            .where('note.archived = :archived', { archived })
            .andWhere('tag.name = :tagName', { tagName })
            .orderBy('note.createdAt', 'DESC')
            .getMany();
    }
}
