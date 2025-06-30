// Authentication module
class Auth {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('meenoe-user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        }
    }

    // Dummy users for demonstration
    getDummyUsers() {
        return [
            {
                id: '1',
                email: 'admin@meenoe.com',
                name: 'John Admin',
                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                organization: 'Meenoe Inc.'
            },
            {
                id: '2',
                email: 'user@meenoe.com',
                name: 'Jane User',
                avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                organization: 'Meenoe Inc.'
            }
        ];
    }

    async login(email, password) {
        this.isLoading = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user in dummy data
        const dummyUsers = this.getDummyUsers();
        const foundUser = dummyUsers.find(u => u.email === email);
        
        if (foundUser && password === 'password') {
            this.currentUser = foundUser;
            localStorage.setItem('meenoe-user', JSON.stringify(foundUser));
            this.isLoading = false;
            return { success: true, user: foundUser };
        }
        
        this.isLoading = false;
        return { success: false, error: 'Invalid email or password' };
    }

    async register(name, email, password) {
        this.isLoading = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const dummyUsers = this.getDummyUsers();
        const existingUser = dummyUsers.find(u => u.email === email);
        if (existingUser) {
            this.isLoading = false;
            return { success: false, error: 'Email already exists' };
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            name,
            organization: 'New Organization',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
        };
        
        this.currentUser = newUser;
        localStorage.setItem('meenoe-user', JSON.stringify(newUser));
        this.isLoading = false;
        return { success: true, user: newUser };
    }

    async forgotPassword(email) {
        this.isLoading = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if email exists
        const dummyUsers = this.getDummyUsers();
        const foundUser = dummyUsers.find(u => u.email === email);
        this.isLoading = false;
        return { success: !!foundUser };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('meenoe-user');
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getUser() {
        return this.currentUser;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = '/';
            return true;
        }
        return false;
    }
}

// Create global auth instance
window.auth = new Auth();