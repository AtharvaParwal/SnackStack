const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.setItem('status', 'loggedOut');

    window.location = "/";
}

export default logout;