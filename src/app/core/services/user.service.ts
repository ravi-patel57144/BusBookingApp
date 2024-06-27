import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
    if (this.isLocalStorageAvailable()) {
      const localStorageBookings = JSON.parse(localStorage.getItem('users') || '[]') as any[];
      if (localStorageBookings.length === 0) {
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    }
  }

  private users: any[] = [
    { id: 1, name: 'Demo User', email: 'demo@example.com', password: 'Demo@123' }
  ];

  register(userDetails: any): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setTimeout(() => {
        if (!this.isLocalStorageAvailable()) {
          observer.error('localStorage is not available');
          return;
        }

        const users = this.getUsersFromLocalStorage();

        const existingUser = users.find((u: any) => u.email === userDetails.email);
        if (existingUser) {
          observer.next(false);
        } else {
          const newUser = {
            ...userDetails,
            id: this.generateUserId(),
            createdAt: userDetails.createdAt,
            modifiedAt: userDetails.modifiedAt,
            isDeleted: userDetails.isDeleted
          };

          users.push(newUser);
          this.saveUsersToLocalStorage(users);
          observer.next(true);
        }
        observer.complete();
      }, 1000);
    });
  }

  private generateUserId(): number {
    const users = this.getUsersFromLocalStorage();
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    return maxId + 1;
  }

  login(email: string, password: string): Observable<boolean> {
    if (!this.isLocalStorageAvailable()) {
      return of(false);
    }

    const users = this.getUsersFromLocalStorage();
    const user = users.find((u: any) => u.email === email && u.password === password && !u.isDeleted);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(true);
    } else {
      return of(false);
    }
  }

  logout(): Observable<boolean> {
    if (!this.isLocalStorageAvailable()) {
      return of(false);
    }

    try {
      localStorage.removeItem('currentUser');
      return of(true);
    } catch (error) {
      console.error('Logout error:', error);
      return of(false);
    }
  }

  getCurrentUser(): any {
    if (!this.isLocalStorageAvailable()) {
      return {};
    }

    const currentUser = localStorage.getItem('currentUser');
    return JSON.parse(currentUser || '{}');
  }

  isLoggedIn(): boolean {
    return this.isLocalStorageAvailable() && !!localStorage.getItem('currentUser');
  }

  private getUsersFromLocalStorage(): any[] {
    if (this.isLocalStorageAvailable()) {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } else {
      console.warn('localStorage is not available. Returning empty array.');
      return [];
    }
  }

  private saveUsersToLocalStorage(users: any[]): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      console.warn('localStorage is not available. Cannot save users.');
    }
  }

  updateUser(userId: number, updatedDetails: any): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (!this.isLocalStorageAvailable()) {
        observer.error('localStorage is not available');
        return;
      }

      const users = this.getUsersFromLocalStorage();
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex > -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...updatedDetails,
          modifiedAt: new Date()
        };
        this.saveUsersToLocalStorage(users);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  deleteUser(userId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (!this.isLocalStorageAvailable()) {
        observer.error('localStorage is not available');
        return;
      }

      const users = this.getUsersFromLocalStorage();
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex > -1) {
        users[userIndex].isDeleted = true;
        users[userIndex].modifiedAt = new Date();
        this.saveUsersToLocalStorage(users);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
