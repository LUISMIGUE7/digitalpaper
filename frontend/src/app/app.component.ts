import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'DigitalPaper';
    isAuthenticated = false;
    currentUser: any = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.isAuthenticated = !!user;
        });
    }

    logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
