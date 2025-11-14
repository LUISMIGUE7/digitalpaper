import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from './note.entity';

@Controller('notes')
export class NoteController {
    constructor(private readonly noteService: NoteService) { }

    @Get()
    findAll(
        @Query('archived') archived?: string,
        @Query('tag') tag?: string,
    ): Promise<Note[]> {
        // Si hay ambos parámetros, filtrar por ambos
        if (archived !== undefined && tag) {
            return this.noteService.findByArchivedAndTag(archived === 'true', tag);
        }
        // Si solo hay archived
        if (archived !== undefined) {
            return this.noteService.findByArchived(archived === 'true');
        }
        // Si solo hay tag
        if (tag) {
            return this.noteService.findByTag(tag);
        }
        // Si no hay parámetros, devolver todas
        return this.noteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Note> {
        return this.noteService.findOne(id);
    }

    @Post()
    create(@Body() noteData: Partial<Note>): Promise<Note> {
        return this.noteService.create(noteData);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() noteData: Partial<Note>): Promise<Note> {
        return this.noteService.update(id, noteData);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.noteService.remove(id);
    }
}
