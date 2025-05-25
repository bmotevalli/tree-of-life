import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginComponent {
  email = signal<string>('');
  password = signal<string>('');
  error = signal<string | null>(null);
  hidePassword = signal<boolean>(true);

  private userService = inject(UserService);

  isFormValid = computed(
    () => this.email().trim() !== '' && this.password().trim() !== ''
  );

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.userService.login(this.email(), this.password()).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        // Optional: fetch and store user info
        this.userService.getCurrentUser().subscribe((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigateByUrl('/notebook');
        });
      },
      error: (err) => {
        console.error(err);
        this.error.set('ورود ناموفق بود');
      },
    });
  }
}
