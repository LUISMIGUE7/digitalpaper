import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Tag } from '../tags/tag.entity';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Note, Tag])],
    providers: [NoteService],
    controllers: [NoteController],
    exports: [NoteService],
})
export class NoteModule { }
