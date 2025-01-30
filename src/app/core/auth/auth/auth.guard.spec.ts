import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let guard: authGuard;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']); // Mock the Router

    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: Router, useValue: mockRouter }, // Provide the mock Router
      ],
    });

    guard = TestBed.inject(authGuard); // Inject the guard
  });

  it('should allow access if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token'); // Mock token in localStorage
    expect(guard.canActivate()).toBe(true); // Guard should allow access
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // No redirection should occur
  });

  it('should deny access if token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Mock no token in localStorage
    expect(guard.canActivate()).toBe(false); // Guard should deny access
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']); // Redirection should occur
  });
});
