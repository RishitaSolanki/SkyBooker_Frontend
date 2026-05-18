import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../SkyBooker/SkyBooker.Frontend/src/components/Navbar.jsx';

describe('Navbar Component', () => {
  test('renders navigation links', () => {
    render(<Navbar page="home" setPage={() => {}} user={null} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('displays Sign In and Register when user is guest (null)', () => {
    render(<Navbar page="home" setPage={() => {}} user={null} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('displays user initial and name when user is logged in', () => {
    const user = { firstName: 'Rishita', email: 'rishita@example.com' };
    render(<Navbar page="home" setPage={() => {}} user={user} />);
    
    expect(screen.getByText('Rishita')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  test('calls setPage when navigation buttons are clicked', () => {
    const setPageMock = jest.fn();
    render(<Navbar page="home" setPage={setPageMock} user={null} />);

    fireEvent.click(screen.getByText('My Trips'));
    expect(setPageMock).toHaveBeenCalledWith('bookings');

    fireEvent.click(screen.getByText('Profile'));
    expect(setPageMock).toHaveBeenCalledWith('profile');
  });

  test('calls onLoginClick and onRegisterClick', () => {
    const loginMock = jest.fn();
    const registerMock = jest.fn();
    render(
      <Navbar
        page="home"
        setPage={() => {}}
        user={null}
        onLoginClick={loginMock}
        onRegisterClick={registerMock}
      />
    );

    fireEvent.click(screen.getByText('Sign In'));
    expect(loginMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Register'));
    expect(registerMock).toHaveBeenCalledTimes(1);
  });
});
