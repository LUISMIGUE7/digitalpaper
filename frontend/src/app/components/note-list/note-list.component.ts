import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NoteService } from '../../services/note.service';

@Component({
    selector: 'app-note-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './note-list.component.html'
})
export class NoteListComponent {
    notes: any[] = [];
    archivedNotes: any[] = [];
    filterTag: string = '';
    showArchived: boolean = false;

    constructor(private noteService: NoteService, private router: Router) { }

    ngOnInit(): void {
        this.loadNotes();
    }

    loadNotes(): void {
        const params: any = { archived: false };
        if (this.filterTag) params.tag = this.filterTag;

        this.noteService.getNotes(params).subscribe(data => {
            this.notes = data;
        });

        // Cargar archivadas aparte, aplicando también el filtro de tag si existe
        const archivedParams: any = { archived: true };
        if (this.filterTag) archivedParams.tag = this.filterTag;
        
        this.noteService.getNotes(archivedParams).subscribe(data => {
            this.archivedNotes = data;
        });
    }

    deleteNote(note: any): void {
        this.noteService.deleteNote(note.id).subscribe(() => this.loadNotes());
    }

    toggleArchive(note: any): void {
        this.noteService.updateNote(note.id, { archived: !note.archived })
            .subscribe(() => this.loadNotes());
    }

    editNote(note: any): void {
        this.router.navigate(['/create-note'], { queryParams: { id: note.id } });
    }

    toggleViewArchived(): void {
        this.showArchived = !this.showArchived;
    }
}
