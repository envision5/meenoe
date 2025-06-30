// Profile page functionality
class ProfileManager {
    constructor() {
        this.user = window.auth?.getUser() || {};
        this.isEditing = false;
        this.avatarFile = null;
        this.init();
    }

    init() {
        console.log('Profile Manager initialized');
    }

    renderProfilePage() {
        return `
            <div class="container-fluid p-4 fade-in">
                <!-- Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 class="h3 mb-1">Profile Settings</h1>
                                <p class="text-muted mb-0">Manage your personal information and account settings</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary" id="cancel-edit-btn" style="display: none;">
                                    <i class="ti ti-x me-2"></i>Cancel
                                </button>
                                <button class="btn btn-primary" id="edit-profile-btn">
                                    <i class="ti ti-edit me-2"></i>Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Profile Information Card -->
                    <div class="col-lg-8">
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-0 pb-0">
                                <h5 class="card-title mb-0">Personal Information</h5>
                            </div>
                            <div class="card-body">
                                <form id="profile-form">
                                    <div class="row">
                                        <!-- Avatar Section -->
                                        <div class="col-12 mb-4">
                                            <div class="profile-avatar-section text-center">
                                                <div class="avatar-upload-container position-relative d-inline-block">
                                                    <div class="current-avatar">
                                                        <img src="${this.user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}" 
                                                             alt="Profile Avatar" 
                                                             class="profile-avatar rounded-circle" 
                                                             width="120" 
                                                             height="120"
                                                             id="profile-avatar-img">
                                                    </div>
                                                    <div class="avatar-upload-overlay" id="avatar-upload-overlay" style="display: none;">
                                                        <div class="upload-icon">
                                                            <i class="ti ti-camera text-white" style="font-size: 2rem;"></i>
                                                        </div>
                                                    </div>
                                                    <input type="file" 
                                                           id="avatar-upload-input" 
                                                           accept="image/*" 
                                                           style="display: none;">
                                                </div>
                                                <div class="mt-3">
                                                    <h6 class="mb-1">${this.user.name || 'User Name'}</h6>
                                                    <p class="text-muted small mb-0">${this.user.email || 'user@example.com'}</p>
                                                    <button type="button" 
                                                            class="btn btn-outline-primary btn-sm mt-2" 
                                                            id="change-avatar-btn" 
                                                            style="display: none;">
                                                        <i class="ti ti-camera me-1"></i>Change Avatar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Personal Details -->
                                        <div class="col-md-6 mb-3">
                                            <label for="first-name" class="form-label">First Name</label>
                                            <input type="text" 
                                                   class="form-control profile-input" 
                                                   id="first-name" 
                                                   value="${this.getFirstName()}" 
                                                   readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="last-name" class="form-label">Last Name</label>
                                            <input type="text" 
                                                   class="form-control profile-input" 
                                                   id="last-name" 
                                                   value="${this.getLastName()}" 
                                                   readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="email" class="form-label">Email Address</label>
                                            <input type="email" 
                                                   class="form-control profile-input" 
                                                   id="email" 
                                                   value="${this.user.email || ''}" 
                                                   readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="phone" class="form-label">Phone Number</label>
                                            <input type="tel" 
                                                   class="form-control profile-input" 
                                                   id="phone" 
                                                   value="${this.user.phone || ''}" 
                                                   readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="job-title" class="form-label">Job Title</label>
                                            <input type="text" 
                                                   class="form-control profile-input" 
                                                   id="job-title" 
                                                   value="${this.user.title || ''}" 
                                                   readonly>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="department" class="form-label">Department</label>
                                            <input type="text" 
                                                   class="form-control profile-input" 
                                                   id="department" 
                                                   value="${this.user.department || ''}" 
                                                   readonly>
                                        </div>
                                        <div class="col-12 mb-3">
                                            <label for="bio" class="form-label">Bio</label>
                                            <textarea class="form-control profile-input" 
                                                      id="bio" 
                                                      rows="3" 
                                                      readonly>${this.user.bio || ''}</textarea>
                                        </div>
                                    </div>

                                    <!-- Save/Cancel Buttons -->
                                    <div class="profile-form-actions" id="profile-form-actions" style="display: none;">
                                        <div class="d-flex gap-2 justify-content-end">
                                            <button type="button" class="btn btn-outline-secondary" id="cancel-changes-btn">
                                                Cancel
                                            </button>
                                            <button type="submit" class="btn btn-primary" id="save-profile-btn">
                                                <span class="btn-text">Save Changes</span>
                                                <span class="spinner-border spinner-border-sm ms-2 d-none" role="status"></span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Security & Settings Sidebar -->
                    <div class="col-lg-4">
                        <!-- Password Change Card -->
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-0 pb-0">
                                <h5 class="card-title mb-0">Security</h5>
                            </div>
                            <div class="card-body">
                                <div class="security-item mb-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 class="mb-1">Password</h6>
                                            <p class="text-muted small mb-0">Last changed 30 days ago</p>
                                        </div>
                                        <button class="btn btn-outline-primary btn-sm" id="change-password-btn">
                                            Change
                                        </button>
                                    </div>
                                </div>
                                <div class="security-item mb-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 class="mb-1">Two-Factor Authentication</h6>
                                            <p class="text-muted small mb-0">Add an extra layer of security</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="two-factor-toggle">
                                        </div>
                                    </div>
                                </div>
                                <div class="security-item">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 class="mb-1">Login Notifications</h6>
                                            <p class="text-muted small mb-0">Get notified of new logins</p>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="login-notifications-toggle" checked>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Account Stats Card -->
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-white border-0 pb-0">
                                <h5 class="card-title mb-0">Account Overview</h5>
                            </div>
                            <div class="card-body">
                                <div class="stat-item mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-primary bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-calendar text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">24</h6>
                                            <small class="text-muted">Meetings Created</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="stat-item mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-success bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-users text-success"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">156</h6>
                                            <small class="text-muted">Collaborations</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-info bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-file-text text-info"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">89</h6>
                                            <small class="text-muted">Files Shared</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Password Change Modal -->
            <div class="modal fade" id="passwordChangeModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">Change Password</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="password-change-form">
                                <div class="mb-3">
                                    <label for="current-password" class="form-label">Current Password</label>
                                    <div class="position-relative">
                                        <input type="password" class="form-control" id="current-password" required>
                                        <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y toggle-password" data-target="current-password">
                                            <i class="ti ti-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="new-password" class="form-label">New Password</label>
                                    <div class="position-relative">
                                        <input type="password" class="form-control" id="new-password" required>
                                        <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y toggle-password" data-target="new-password">
                                            <i class="ti ti-eye"></i>
                                        </button>
                                    </div>
                                    <div class="password-strength mt-2">
                                        <div class="progress" style="height: 4px;">
                                            <div class="progress-bar" id="password-strength-bar" style="width: 0%"></div>
                                        </div>
                                        <small class="text-muted" id="password-strength-text">Enter a password</small>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="confirm-new-password" class="form-label">Confirm New Password</label>
                                    <div class="position-relative">
                                        <input type="password" class="form-control" id="confirm-new-password" required>
                                        <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y toggle-password" data-target="confirm-new-password">
                                            <i class="ti ti-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="alert alert-info">
                                    <i class="ti ti-info-circle me-2"></i>
                                    <small>Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.</small>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" form="password-change-form" class="btn btn-primary" id="save-password-btn">
                                <span class="btn-text">Change Password</span>
                                <span class="spinner-border spinner-border-sm ms-2 d-none" role="status"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .profile-avatar {
                    object-fit: cover;
                    border: 4px solid #fff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                }

                .avatar-upload-container {
                    cursor: pointer;
                }

                .avatar-upload-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .avatar-upload-container:hover .avatar-upload-overlay {
                    opacity: 1;
                }

                .profile-input:read-only {
                    background-color: #f8f9fa;
                    border-color: #e9ecef;
                }

                .profile-input:not([readonly]) {
                    background-color: #fff;
                    border-color: #ced4da;
                }

                .profile-input:not([readonly]):focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
                }

                .security-item {
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 0.5rem;
                    border: 1px solid #e9ecef;
                }

                .stat-item {
                    padding: 0.75rem;
                    background: #f8f9fa;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                }

                .stat-item:hover {
                    background: #e9ecef;
                }

                .stat-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .toggle-password {
                    border: none;
                    background: none;
                    color: #6c757d;
                    padding: 0.375rem 0.75rem;
                }

                .toggle-password:hover {
                    color: #2563eb;
                }

                .password-strength .progress {
                    background-color: #e9ecef;
                }

                .password-strength .progress-bar {
                    transition: all 0.3s ease;
                }

                .form-check-input:checked {
                    background-color: #2563eb;
                    border-color: #2563eb;
                }

                @media (max-width: 768px) {
                    .profile-avatar {
                        width: 100px;
                        height: 100px;
                    }
                    
                    .container-fluid {
                        padding: 1rem;
                    }
                }
            </style>
        `;
    }

    getFirstName() {
        if (!this.user.name) return '';
        return this.user.name.split(' ')[0] || '';
    }

    getLastName() {
        if (!this.user.name) return '';
        const parts = this.user.name.split(' ');
        return parts.slice(1).join(' ') || '';
    }

    setupEventListeners() {
        // Edit profile button
        const editBtn = document.getElementById('edit-profile-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const formActions = document.getElementById('profile-form-actions');
        const avatarOverlay = document.getElementById('avatar-upload-overlay');
        const changeAvatarBtn = document.getElementById('change-avatar-btn');

        editBtn?.addEventListener('click', () => {
            this.toggleEditMode(true);
        });

        cancelBtn?.addEventListener('click', () => {
            this.toggleEditMode(false);
        });

        document.getElementById('cancel-changes-btn')?.addEventListener('click', () => {
            this.toggleEditMode(false);
        });

        // Profile form submission
        document.getElementById('profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Avatar upload
        const avatarContainer = document.querySelector('.avatar-upload-container');
        const avatarInput = document.getElementById('avatar-upload-input');

        avatarContainer?.addEventListener('click', () => {
            if (this.isEditing) {
                avatarInput?.click();
            }
        });

        changeAvatarBtn?.addEventListener('click', () => {
            avatarInput?.click();
        });

        avatarInput?.addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // Password change
        document.getElementById('change-password-btn')?.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('passwordChangeModal'));
            modal.show();
        });

        // Password form submission
        document.getElementById('password-change-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Password visibility toggles
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.closest('.toggle-password').getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = e.target.closest('.toggle-password').querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'ti ti-eye-off';
                } else {
                    input.type = 'password';
                    icon.className = 'ti ti-eye';
                }
            });
        });

        // Password strength checker
        document.getElementById('new-password')?.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Security toggles
        document.getElementById('two-factor-toggle')?.addEventListener('change', (e) => {
            this.toggleTwoFactor(e.target.checked);
        });

        document.getElementById('login-notifications-toggle')?.addEventListener('change', (e) => {
            this.toggleLoginNotifications(e.target.checked);
        });
    }

    toggleEditMode(editing) {
        this.isEditing = editing;
        const inputs = document.querySelectorAll('.profile-input');
        const editBtn = document.getElementById('edit-profile-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const formActions = document.getElementById('profile-form-actions');
        const avatarOverlay = document.getElementById('avatar-upload-overlay');
        const changeAvatarBtn = document.getElementById('change-avatar-btn');

        inputs.forEach(input => {
            input.readOnly = !editing;
        });

        if (editing) {
            editBtn.style.display = 'none';
            cancelBtn.style.display = 'inline-block';
            formActions.style.display = 'block';
            avatarOverlay.style.display = 'flex';
            changeAvatarBtn.style.display = 'inline-block';
        } else {
            editBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'none';
            formActions.style.display = 'none';
            avatarOverlay.style.display = 'none';
            changeAvatarBtn.style.display = 'none';
            this.resetForm();
        }
    }

    resetForm() {
        // Reset form to original values
        document.getElementById('first-name').value = this.getFirstName();
        document.getElementById('last-name').value = this.getLastName();
        document.getElementById('email').value = this.user.email || '';
        document.getElementById('phone').value = this.user.phone || '';
        document.getElementById('job-title').value = this.user.title || '';
        document.getElementById('department').value = this.user.department || '';
        document.getElementById('bio').value = this.user.bio || '';
        
        // Reset avatar
        const avatarImg = document.getElementById('profile-avatar-img');
        avatarImg.src = this.user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
        this.avatarFile = null;
    }

    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showAlert('Please select a valid image file.', 'danger');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showAlert('Image size must be less than 5MB.', 'danger');
            return;
        }

        this.avatarFile = file;

        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarImg = document.getElementById('profile-avatar-img');
            avatarImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async saveProfile() {
        const saveBtn = document.getElementById('save-profile-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const spinner = saveBtn.querySelector('.spinner-border');

        // Show loading state
        btnText.textContent = 'Saving...';
        spinner.classList.remove('d-none');
        saveBtn.disabled = true;

        try {
            // Collect form data
            const formData = {
                firstName: document.getElementById('first-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                jobTitle: document.getElementById('job-title').value.trim(),
                department: document.getElementById('department').value.trim(),
                bio: document.getElementById('bio').value.trim()
            };

            // Validate required fields
            if (!formData.firstName || !formData.email) {
                this.showAlert('First name and email are required.', 'danger');
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update user object
            this.user.name = `${formData.firstName} ${formData.lastName}`.trim();
            this.user.email = formData.email;
            this.user.phone = formData.phone;
            this.user.title = formData.jobTitle;
            this.user.department = formData.department;
            this.user.bio = formData.bio;

            // Handle avatar upload
            if (this.avatarFile) {
                // In a real app, this would upload to a server
                // For now, we'll just use the local file URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.user.avatar = e.target.result;
                    // Update auth user
                    if (window.auth) {
                        const currentUser = window.auth.getUser();
                        Object.assign(currentUser, this.user);
                        localStorage.setItem('meenoe-user', JSON.stringify(currentUser));
                        window.updateUserInfo?.();
                    }
                };
                reader.readAsDataURL(this.avatarFile);
            }

            // Update auth user
            if (window.auth) {
                const currentUser = window.auth.getUser();
                Object.assign(currentUser, this.user);
                localStorage.setItem('meenoe-user', JSON.stringify(currentUser));
                window.updateUserInfo?.();
            }

            this.showAlert('Profile updated successfully!', 'success');
            this.toggleEditMode(false);

            // Create notification
            if (window.NotificationUtils) {
                window.NotificationUtils.notifySystem(
                    this.user.id,
                    'Profile Updated',
                    'Your profile information has been updated successfully',
                    '/profile',
                    'View Profile'
                );
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            this.showAlert('Failed to save profile. Please try again.', 'danger');
        } finally {
            // Reset button state
            btnText.textContent = 'Save Changes';
            spinner.classList.add('d-none');
            saveBtn.disabled = false;
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;

        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showAlert('All password fields are required.', 'danger');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showAlert('New passwords do not match.', 'danger');
            return;
        }

        if (newPassword.length < 8) {
            this.showAlert('Password must be at least 8 characters long.', 'danger');
            return;
        }

        const saveBtn = document.getElementById('save-password-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const spinner = saveBtn.querySelector('.spinner-border');

        // Show loading state
        btnText.textContent = 'Changing...';
        spinner.classList.remove('d-none');
        saveBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real app, verify current password and update
            if (currentPassword !== 'password') {
                this.showAlert('Current password is incorrect.', 'danger');
                return;
            }

            this.showAlert('Password changed successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('passwordChangeModal'));
            modal.hide();

            // Reset form
            document.getElementById('password-change-form').reset();

            // Create notification
            if (window.NotificationUtils) {
                window.NotificationUtils.notifySystem(
                    this.user.id,
                    'Password Changed',
                    'Your password has been updated successfully',
                    '/profile',
                    'View Profile'
                );
            }

        } catch (error) {
            console.error('Error changing password:', error);
            this.showAlert('Failed to change password. Please try again.', 'danger');
        } finally {
            // Reset button state
            btnText.textContent = 'Change Password';
            spinner.classList.add('d-none');
            saveBtn.disabled = false;
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');

        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                strengthBar.style.width = '20%';
                strengthBar.className = 'progress-bar bg-danger';
                feedback = 'Very weak';
                break;
            case 2:
                strengthBar.style.width = '40%';
                strengthBar.className = 'progress-bar bg-warning';
                feedback = 'Weak';
                break;
            case 3:
                strengthBar.style.width = '60%';
                strengthBar.className = 'progress-bar bg-info';
                feedback = 'Fair';
                break;
            case 4:
                strengthBar.style.width = '80%';
                strengthBar.className = 'progress-bar bg-primary';
                feedback = 'Good';
                break;
            case 5:
                strengthBar.style.width = '100%';
                strengthBar.className = 'progress-bar bg-success';
                feedback = 'Strong';
                break;
        }

        strengthText.textContent = feedback;
    }

    toggleTwoFactor(enabled) {
        console.log('Two-factor authentication:', enabled ? 'enabled' : 'disabled');
        this.showAlert(
            `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`,
            enabled ? 'success' : 'info'
        );
    }

    toggleLoginNotifications(enabled) {
        console.log('Login notifications:', enabled ? 'enabled' : 'disabled');
        this.showAlert(
            `Login notifications ${enabled ? 'enabled' : 'disabled'}.`,
            enabled ? 'success' : 'info'
        );
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Create global instance
window.profileManager = new ProfileManager();

// Make loadProfile globally accessible
window.loadProfile = function loadProfile() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = window.profileManager.renderProfilePage();
    window.profileManager.setupEventListeners();
};