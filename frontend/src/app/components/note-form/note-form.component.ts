import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';

@Component({
    selector: 'app-note-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './note-form.component.html'
})
export class NoteFormComponent {
    id: number | null = null;
    title: string = '';
    content: string = '';
    tags: string = '';

    constructor(
        private noteService: NoteService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.noteService.getNote(this.id).subscribe(note => {
                    this.title = note.title;
                    this.content = note.content;
                    this.tags = note.tags.map((t: any) => t.name).join(', ');
                });
            }
        });
    }

    saveNote(): void {
        const tagArray = this.tags
            .split(',')
            .map(t => ({ name: t.trim() }))
            .filter(t => t.name);

        const noteData = { title: this.title, content: this.content, tags: tagArray };

        if (this.id) {
            this.noteService.updateNote(this.id, noteData).subscribe(() => {
                alert('Nota actualizada con éxito');
                this.router.navigate(['/notes']);
            });
        } else {
            this.noteService.createNote(noteData).subscribe(() => {
                alert('Nota creada con éxito');
                this.router.navigate(['/notes']);
            });
        }
    }
}
