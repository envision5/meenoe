// Organization page functionality
function loadOrganization() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">Organization</h1>
                            <p class="text-muted mb-0">Manage your organization settings and team members</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" id="invite-members-btn">
                                <i class="ti ti-user-plus me-2"></i>
                                Invite Members
                            </button>
                            <button class="btn btn-primary" id="edit-org-btn">
                                <i class="ti ti-edit me-2"></i>
                                Edit Organization
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Organization Info Card -->
            <div class="row mb-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-4">
                                <div class="org-logo me-4">
                                    <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1" 
                                         alt="Organization Logo" 
                                         class="rounded" 
                                         width="100" 
                                         height="100">
                                </div>
                                <div>
                                    <h4 class="mb-1">Meenoe Inc.</h4>
                                    <p class="text-muted mb-2">Software Development & Collaboration Tools</p>
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-success me-2">Enterprise Plan</span>
                                        <span class="text-muted small">Since January 2023</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="mb-2">Contact Information</h6>
                                    <p class="mb-1"><i class="ti ti-mail me-2 text-muted"></i> contact@meenoe.com</p>
                                    <p class="mb-1"><i class="ti ti-phone me-2 text-muted"></i> +1 (555) 123-4567</p>
                                    <p class="mb-3"><i class="ti ti-world me-2 text-muted"></i> www.meenoe.com</p>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="mb-2">Address</h6>
                                    <p class="mb-1">123 Tech Avenue</p>
                                    <p class="mb-1">Suite 400</p>
                                    <p class="mb-1">San Francisco, CA 94107</p>
                                    <p class="mb-3">United States</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12">
                                    <h6 class="mb-2">About</h6>
                                    <p class="mb-0">
                                        Meenoe Inc. is a leading provider of collaborative meeting management solutions. 
                                        Our platform helps teams streamline their meeting workflows, capture important 
                                        decisions, and track action items to ensure productivity and accountability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white border-0 pb-0">
                            <h5 class="card-title mb-0">Organization Stats</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-primary bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-users text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">24</h6>
                                            <small class="text-muted">Team Members</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-success bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-calendar text-success"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">156</h6>
                                            <small class="text-muted">Meetings</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-info bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-file-text text-info"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">89</h6>
                                            <small class="text-muted">Files</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex align-items-center">
                                        <div class="stat-icon bg-warning bg-opacity-10 p-2 rounded me-3">
                                            <i class="ti ti-check text-warning"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">432</h6>
                                            <small class="text-muted">Tasks</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 pb-0">
                            <h5 class="card-title mb-0">Subscription</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 class="mb-1">Enterprise Plan</h6>
                                    <p class="text-muted mb-0 small">Unlimited users & features</p>
                                </div>
                                <span class="badge bg-success">Active</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 class="mb-1">Next Renewal</h6>
                                    <p class="text-muted mb-0 small">January 15, 2025</p>
                                </div>
                                <button class="btn btn-sm btn-outline-primary">Manage</button>
                            </div>
                            <div class="progress mb-2" style="height: 6px;">
                                <div class="progress-bar bg-primary" style="width: 75%"></div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Storage: 75% used</small>
                                <small class="text-muted">750GB / 1TB</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Members Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Team Members</h5>
                            <a href="/organization-staff" class="btn btn-outline-primary btn-sm" data-page="organization-staff">
                                View All Members
                            </a>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">John Admin</div>
                                                        <small class="text-muted">john.admin@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-primary">Admin</span>
                                            </td>
                                            <td>Management</td>
                                            <td>
                                                <span class="badge bg-success">Active</span>
                                            </td>
                                            <td>Just now</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Jane User</div>
                                                        <small class="text-muted">jane.user@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-info">Manager</span>
                                            </td>
                                            <td>Product</td>
                                            <td>
                                                <span class="badge bg-success">Active</span>
                                            </td>
                                            <td>2 hours ago</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Sarah Johnson</div>
                                                        <small class="text-muted">sarah.j@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">Member</span>
                                            </td>
                                            <td>Design</td>
                                            <td>
                                                <span class="badge bg-warning">Away</span>
                                            </td>
                                            <td>Yesterday</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Departments Section -->
            <div class="row">
                <div class="col-lg-6 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Departments</h5>
                            <button class="btn btn-outline-primary btn-sm">
                                <i class="ti ti-plus me-1"></i> Add Department
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="list-group list-group-flush">
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Management</h6>
                                            <small class="text-muted">3 members</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Product</h6>
                                            <small class="text-muted">8 members</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Design</h6>
                                            <small class="text-muted">5 members</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Engineering</h6>
                                            <small class="text-muted">12 members</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Roles & Permissions</h5>
                            <button class="btn btn-outline-primary btn-sm">
                                <i class="ti ti-plus me-1"></i> Add Role
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="list-group list-group-flush">
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Admin</h6>
                                            <small class="text-muted">Full access to all features</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary">Manage</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Manager</h6>
                                            <small class="text-muted">Can manage teams and meetings</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary">Manage</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Member</h6>
                                            <small class="text-muted">Can participate in meetings</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary">Manage</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">Guest</h6>
                                            <small class="text-muted">Limited access to specific meetings</small>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-secondary">Manage</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .org-logo img {
                object-fit: cover;
                border: 1px solid #e9ecef;
            }

            .stat-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .list-group-item {
                padding-top: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e9ecef !important;
            }

            .list-group-item:last-child {
                border-bottom: none !important;
            }

            @media (max-width: 768px) {
                .org-logo img {
                    width: 80px;
                    height: 80px;
                }
            }
        </style>
    `;

    // Set up event listeners
    const inviteMembersBtn = document.getElementById('invite-members-btn');
    if (inviteMembersBtn) {
        inviteMembersBtn.addEventListener('click', () => {
            // In a real app, this would open an invite modal
            alert('Invite Members functionality would open a modal here.');
        });
    }

    const editOrgBtn = document.getElementById('edit-org-btn');
    if (editOrgBtn) {
        editOrgBtn.addEventListener('click', () => {
            // In a real app, this would enable editing of organization details
            alert('Edit Organization functionality would allow editing organization details.');
        });
    }
}

function loadOrganizationStaff() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">Team Members</h1>
                            <p class="text-muted mb-0">Manage your organization's team members and their roles</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary">
                                <i class="ti ti-filter me-2"></i>
                                Filter
                            </button>
                            <button class="btn btn-primary" id="add-member-btn">
                                <i class="ti ti-user-plus me-2"></i>
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search and Filters -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="ti ti-search"></i>
                                        </span>
                                        <input type="text" class="form-control border-start-0" placeholder="Search members...">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-select">
                                        <option value="">All Departments</option>
                                        <option value="management">Management</option>
                                        <option value="product">Product</option>
                                        <option value="design">Design</option>
                                        <option value="engineering">Engineering</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-select">
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="member">Member</option>
                                        <option value="guest">Guest</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <select class="form-select">
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="away">Away</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Members Table -->
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="select-all">
                                                </div>
                                            </th>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">John Admin</div>
                                                        <small class="text-muted">john.admin@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-primary">Admin</span>
                                            </td>
                                            <td>Management</td>
                                            <td>
                                                <span class="badge bg-success">Active</span>
                                            </td>
                                            <td>Just now</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Jane User</div>
                                                        <small class="text-muted">jane.user@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-info">Manager</span>
                                            </td>
                                            <td>Product</td>
                                            <td>
                                                <span class="badge bg-success">Active</span>
                                            </td>
                                            <td>2 hours ago</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Sarah Johnson</div>
                                                        <small class="text-muted">sarah.j@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">Member</span>
                                            </td>
                                            <td>Design</td>
                                            <td>
                                                <span class="badge bg-warning">Away</span>
                                            </td>
                                            <td>Yesterday</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Michael Chen</div>
                                                        <small class="text-muted">michael.c@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">Member</span>
                                            </td>
                                            <td>Engineering</td>
                                            <td>
                                                <span class="badge bg-secondary">Inactive</span>
                                            </td>
                                            <td>3 days ago</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                                                         class="rounded-circle me-2" 
                                                         width="40" 
                                                         height="40"
                                                         alt="Profile">
                                                    <div>
                                                        <div class="fw-semibold">Emily Rodriguez</div>
                                                        <small class="text-muted">emily.r@meenoe.com</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-info">Manager</span>
                                            </td>
                                            <td>Engineering</td>
                                            <td>
                                                <span class="badge bg-success">Active</span>
                                            </td>
                                            <td>1 day ago</td>
                                            <td>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        Actions
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">Edit</a></li>
                                                        <li><a class="dropdown-item" href="#">View Profile</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#">Remove</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted">Showing 5 of 24 members</span>
                                </div>
                                <nav>
                                    <ul class="pagination pagination-sm mb-0">
                                        <li class="page-item disabled">
                                            <a class="page-link" href="#" tabindex="-1">Previous</a>
                                        </li>
                                        <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item">
                                            <a class="page-link" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .table th, .table td {
                vertical-align: middle;
            }

            .form-check-input {
                cursor: pointer;
            }

            .page-link {
                color: #2563eb;
            }

            .page-item.active .page-link {
                background-color: #2563eb;
                border-color: #2563eb;
            }

            @media (max-width: 768px) {
                .container-fluid {
                    padding: 1rem;
                }
            }
        </style>
    `;

    // Set up event listeners
    const addMemberBtn = document.getElementById('add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            // In a real app, this would open an add member modal
            alert('Add Member functionality would open a modal here.');
        });
    }

    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('tbody .form-check-input');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }
}

// Make functions globally accessible
window.loadOrganization = loadOrganization;
window.loadOrganizationStaff = loadOrganizationStaff;