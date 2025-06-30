export function loadDashboard() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Welcome Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">Welcome back! 👋</h1>
                            <p class="text-muted mb-0">Here's what's happening with your meetings today.</p>
                        </div>
                        <button class="btn btn-primary" onclick="window.router.navigate('create-new')">
                            <i class="ti ti-plus me-2"></i>
                            New Meeting
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="stats-card">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-muted small mb-1">Total Meetings</p>
                                <h3 class="h4 mb-0">24</h3>
                                <small class="text-success">+12% from last month</small>
                            </div>
                            <div class="bg-primary bg-opacity-10 p-3 rounded-circle">
                                <i class="ti ti-video text-primary" style="width: 24px; height: 24px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="stats-card">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-muted small mb-1">Active Projects</p>
                                <h3 class="h4 mb-0">8</h3>
                                <small class="text-success">+5% from last month</small>
                            </div>
                            <div class="bg-success bg-opacity-10 p-3 rounded-circle">
                                <i class="ti ti-file-text text-success" style="width: 24px; height: 24px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="stats-card">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-muted small mb-1">Team Members</p>
                                <h3 class="h4 mb-0">12</h3>
                                <small class="text-success">+2 from last month</small>
                            </div>
                            <div class="bg-info bg-opacity-10 p-3 rounded-circle">
                                <i class="ti ti-users text-info" style="width: 24px; height: 24px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="stats-card">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-muted small mb-1">Completion Rate</p>
                                <h3 class="h4 mb-0">94%</h3>
                                <small class="text-success">+3% from last month</small>
                            </div>
                            <div class="bg-warning bg-opacity-10 p-3 rounded-circle">
                                <i class="ti ti-trending-up text-warning" style="width: 24px; height: 24px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Meetings -->
            <div class="row">
                <div class="col-lg-8 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 pb-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">Recent Meetings</h5>
                                <button class="btn btn-outline-primary btn-sm" onclick="window.router.navigate('my-meenoes')">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Meeting</th>
                                            <th>Date & Time</th>
                                            <th>Participants</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <div class="fw-semibold">Weekly Team Standup</div>
                                                    <small class="text-muted">recurring</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div>Jan 15, 2024</div>
                                                    <small class="text-muted">10:00 AM</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <i class="ti ti-users me-1" style="width: 16px; height: 16px;"></i>
                                                    8
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-success d-flex align-items-center">
                                                    <i class="ti ti-check me-1" style="width: 12px; height: 12px;"></i>
                                                    Completed
                                                </span>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-outline-primary">View</button>
                                                    <button class="btn btn-outline-secondary">Edit</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>
                                                    <div class="fw-semibold">Product Roadmap Review</div>
                                                    <small class="text-muted">planning</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div>Jan 14, 2024</div>
                                                    <small class="text-muted">2:00 PM</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <i class="ti ti-users me-1" style="width: 16px; height: 16px;"></i>
                                                    12
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-success d-flex align-items-center">
                                                    <i class="ti ti-check me-1" style="width: 12px; height: 12px;"></i>
                                                    Completed
                                                </span>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-outline-primary">View</button>
                                                    <button class="btn btn-outline-secondary">Edit</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>
                                                    <div class="fw-semibold">Client Presentation Prep</div>
                                                    <small class="text-muted">preparation</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div>Jan 16, 2024</div>
                                                    <small class="text-muted">11:30 AM</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <i class="ti ti-users me-1" style="width: 16px; height: 16px;"></i>
                                                    5
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-warning d-flex align-items-center">
                                                    <i class="ti ti-clock me-1" style="width: 12px; height: 12px;"></i>
                                                    Upcoming
                                                </span>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-outline-primary">View</button>
                                                    <button class="btn btn-outline-secondary">Edit</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upcoming Tasks -->
                <div class="col-lg-4 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 pb-0">
                            <h5 class="card-title mb-0">Upcoming Tasks</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group list-group-flush">
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold">Review meeting notes from yesterday</div>
                                            <small class="text-muted">Due: Jan 15, 2024</small>
                                        </div>
                                        <div class="ms-2">
                                            <span class="badge bg-danger">High</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold">Prepare presentation slides</div>
                                            <small class="text-muted">Due: Jan 16, 2024</small>
                                        </div>
                                        <div class="ms-2">
                                            <span class="badge bg-warning">Medium</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold">Follow up with client feedback</div>
                                            <small class="text-muted">Due: Jan 15, 2024</small>
                                        </div>
                                        <div class="ms-2">
                                            <span class="badge bg-danger">High</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item border-0 px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold">Update project timeline</div>
                                            <small class="text-muted">Due: Jan 18, 2024</small>
                                        </div>
                                        <div class="ms-2">
                                            <span class="badge bg-secondary">Low</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center mt-3">
                                <button class="btn btn-outline-primary btn-sm" onclick="window.router.navigate('my-files')">
                                    View All Tasks
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <h5 class="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <div class="card text-decoration-none meeting-card h-100" style="cursor: pointer;" onclick="window.router.navigate('create-new')">
                                        <div class="card-body text-center">
                                            <i class="ti ti-plus text-primary mb-2" style="width: 32px; height: 32px;"></i>
                                            <h6 class="card-title">Start New Meeting</h6>
                                            <p class="card-text small text-muted">Create and schedule a new meeting</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card text-decoration-none meeting-card h-100" style="cursor: pointer;" onclick="window.router.navigate('my-files')">
                                        <div class="card-body text-center">
                                            <i class="ti ti-file-text text-success mb-2" style="width: 32px; height: 32px;"></i>
                                            <h6 class="card-title">Upload Files</h6>
                                            <p class="card-text small text-muted">Share documents and resources</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card text-decoration-none meeting-card h-100" style="cursor: pointer;" onclick="window.router.navigate('organization')">
                                        <div class="card-body text-center">
                                            <i class="ti ti-users text-info mb-2" style="width: 32px; height: 32px;"></i>
                                            <h6 class="card-title">Invite Team</h6>
                                            <p class="card-text small text-muted">Add members to your organization</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card text-decoration-none meeting-card h-100" style="cursor: pointer;" onclick="window.router.navigate('support')">
                                        <div class="card-body text-center">
                                            <i class="ti ti-calendar text-warning mb-2" style="width: 32px; height: 32px;"></i>
                                            <h6 class="card-title">View Calendar</h6>
                                            <p class="card-text small text-muted">See all scheduled meetings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
