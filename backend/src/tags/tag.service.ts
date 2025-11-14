import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    ) { }

    async findAll(): Promise<Tag[]> {
        return this.tagRepo.find();
    }

    async findOne(id: number): Promise<Tag> {
        const tag = await this.tagRepo.findOne({ where: { id } });
        if (!tag) throw new NotFoundException(`Tag con id ${id} no encontrado`);
        return tag;
    }

    async create(tagData: Partial<Tag>): Promise<Tag> {
        const tag = this.tagRepo.create(tagData);
        return this.tagRepo.save(tag);
    }

    async update(id: number, tagData: Partial<Tag>): Promise<Tag> {
        await this.tagRepo.update(id, tagData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.tagRepo.delete(id);
    }
}
