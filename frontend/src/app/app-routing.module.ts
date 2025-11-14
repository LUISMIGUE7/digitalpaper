import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list.component';
import { NoteFormComponent } from './components/note-form/note-form.component';

const routes: Routes = [
    { path: 'notes', component: NoteListComponent },
    { path: 'create-note', component: NoteFormComponent },
    { path: '', redirectTo: '/notes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
