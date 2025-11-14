import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Get()
    findAll(): Promise<Tag[]> {
        return this.tagService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Tag> {
        return this.tagService.findOne(id);
    }

    @Post()
    create(@Body() tagData: Partial<Tag>): Promise<Tag> {
        return this.tagService.create(tagData);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() tagData: Partial<Tag>): Promise<Tag> {
        return this.tagService.update(id, tagData);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.tagService.remove(id);
    }
}
