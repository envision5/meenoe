// Create New page functionality
export function loadCreateNew() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Load the create new page HTML
    mainContent.innerHTML = `
<!-- Main Container -->
<div class="container-fluid g-0 min-vh-100 d-flex flex-column">
  <!-- Header -->
  <header class="bg-white shadow-sm mb-2">
    <div class="container-fluid py-2 px-4">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <h1 id="meenoe-name2" class="h4 mb-0 me-3">
            <input type="text" class="form-control-plaintext fw-bold fs-4 p-1" value="Name Your Meenoe Here">
          </h1>
          <div class="avatar-stack d-flex align-items-center">
            <button id="addUserButton" class="btn btn-sm btn-outline-primary rounded-circle" style="width: 32px; height: 32px;">
            <i class="ti ti-plus"></i>
            </button>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div class="dropdown me-3">
            <button class="btn btn-sm dropdown-toggle d-flex align-items-center" type="button" id="publishingStatus" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="status-indicator bg-success me-2"></span>
            <span class="status-text">Live</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="publishingStatus">
              <li><a class="dropdown-item status-option" href="#" data-status="Review" data-bg="secondary">
                <span class="status-indicator bg-secondary me-2"></span>Review
                </a>
              </li>
              <li><a class="dropdown-item status-option" href="#" data-status="Live" data-bg="success">
                <span class="status-indicator bg-success me-2"></span>Live
                </a>
              </li>
              <li><a class="dropdown-item status-option" href="#" data-status="Locked" data-bg="warning">
                <span class="status-indicator bg-warning me-2"></span>Locked
                </a>
              </li>
              <li><a class="dropdown-item status-option" href="#" data-status="Closed" data-bg="danger">
                <span class="status-indicator bg-danger me-2"></span>Closed
                </a>
              </li>
            </ul>
          </div>
          <div class="dropdown">
            <button class="btn btn-sm btn-gradient dropdown-toggle d-flex align-items-center" type="button" id="layoutDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="ti ti-layout-dashboard me-1"></i>
            <span>Layout</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="layoutDropdown">
              <li><a class="dropdown-item d-flex align-items-center" href="#" data-layout="default">
                <i class="ti ti-layout-dashboard me-2"></i>Default
                </a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item d-flex align-items-center" href="#" data-layout="running">
                <i class="ti ti-player-play me-2"></i>Running Page
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- Main Content -->
  <main class="flex-grow-1 d-flex flex-column">
    <!-- Tab Navigation (Visible in default layout) -->
    <nav class="border-bottom tab-navigation">
      <div class="container-fluid">
        <ul class="nav nav-tabs border-0" id="mainTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="setup-tab" data-bs-toggle="tab" data-bs-target="#setup" type="button" role="tab" aria-controls="setup" aria-selected="true">
            <i class="ti ti-info-square-rounded fs-4 me-2"></i></i> Details
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="agenda-tab" data-bs-toggle="tab" data-bs-target="#agenda" type="button" role="tab" aria-controls="agenda" aria-selected="false">
            <i class="ti ti-clipboard-list fs-4 me-2"></i> Agenda
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="actions-tab" data-bs-toggle="tab" data-bs-target="#actions" type="button" role="tab" aria-controls="actions" aria-selected="false">
            <i class="ti ti-subtask fs-4 me-2"></i></i> Actions
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Layout Container -->
    <div class="layout-container flex-grow-1">
      <!-- Default Layout (Tabbed) -->
      <div class="layout-default h-100">
        <div class="tab-content h-100" id="mainTabsContent">
          <!-- Details Tab -->
          <div class="tab-pane fade show active h-100" id="setup" role="tabpanel" aria-labelledby="setup-tab">
            <div class="container-fluid h-100 pt-3">
              <div id="meenoe-details-tab" class="row h-100 justify-content-center">
                <div class="col-12 col-xl-10 mx-auto d-flex flex-column gap-4">
                  <section class="pt-5 pt-md-14 pt-lg-12 pb-4 pb-md-5 pb-lg-14">
                    <div class="container-fluid">
                      <div class="d-flex mb-4 gap-3">
                        <h2 id="meenoe-name" class="fs-10 fw-bolder text-center mb-0">Name Your Meenoe Here</h2>
                        <a id="edit-meenoe-name" class="btn btn-gradient">
                        <i class="ti ti-edit me-2"></i>
                        Edit Meenoe Title
                        </a>
                      </div>
                      <div class="row">
                        <div class="col-lg-12">
              <div class="d-flex mb-4 gap-3">
                            <h5 class="fs-10 fw-bolder">Objective</h5>
              <a id="edit-objective" type="button" class="">
                              <i class="ti ti-edit me-2"></i>
              </a>
              </div>
                          <p id="objective-text" class="fs-4 border-bottom pb-3 mb-5">
                            Enter your Meenoe objective or an introduction here 
                          </p>
                        </div>
                      </div>
                      <div id="meenoe-at-a-glance" class="row">
                        <div class="col-lg-3 col-md-6 mb-4">
                          <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow" data-card-type="users">
                            <div class="card-body p-4">
                              <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                  <div class="icon-box bg-primary-subtle rounded-3 p-3 me-3">
                                    <i class="ti ti-users text-primary fs-4"></i>
                                  </div>
                                  <div>
                                    <h5 class="card-title mb-0 fw-semibold">
                                      <span id="users-count" class="counter-value">0</span> Users
                                    </h5>
                                  </div>
                                </div>
                                <div class="dropdown">
                                  <button class="btn btn-sm btn-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ti ti-dots-vertical"></i>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" id="add-users-dropdown">Add Users</a></li>
                                    <li><a class="dropdown-item" href="#" id="manage-users-dropdown">Manage Users</a></li>
                                  </ul>
                                </div>
                              </div>
                              <p class="card-text text-muted mb-0">People participating in this meenoe</p>
                              <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar bg-primary users-progress-bar" role="progressbar" style="width: 0%"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                          <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow" data-card-type="agenda">
                            <div class="card-body p-4">
                              <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                  <div class="icon-box bg-info-subtle rounded-3 p-3 me-3">
                                    <i class="ti ti-clipboard-list text-info fs-4"></i>
                                  </div>
                                  <div>
                                    <h5 class="card-title mb-0 fw-semibold">
                                      <span id="agenda-count" class="counter-value">0</span> Agenda
                                    </h5>
                                  </div>
                                </div>
                                <div class="dropdown">
                                  <button class="btn btn-sm btn-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ti ti-dots-vertical"></i>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" id="add-agenda-dropdown">Add Agenda</a></li>
                                    <li><a class="dropdown-item" href="#" id="view-agenda-dropdown">View All</a></li>
                                  </ul>
                                </div>
                              </div>
                              <p class="card-text text-muted mb-0">Topics to be discussed</p>
                              <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar bg-info agenda-progress-bar" role="progressbar" style="width: 0%"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                          <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow" data-card-type="files">
                            <div class="card-body p-4">
                              <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                  <div class="icon-box bg-success-subtle rounded-3 p-3 me-3">
                                    <i class="ti ti-paperclip text-success fs-4"></i>
                                  </div>
                                  <div>
                                    <h5 class="card-title mb-0 fw-semibold">
                                      <span id="files-count" class="counter-value">0</span> Files
                                    </h5>
                                  </div>
                                </div>
                                <div class="dropdown">
                                  <button class="btn btn-sm btn-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ti ti-dots-vertical"></i>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" id="upload-files-dropdown">Upload Files</a></li>
                                    <li><a class="dropdown-item" href="#" id="view-files-dropdown">View All</a></li>
                                  </ul>
                                </div>
                              </div>
                              <p class="card-text text-muted mb-0">Documents and attachments</p>
                              <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar bg-success files-progress-bar" role="progressbar" style="width: 0%"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                          <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow" data-card-type="actions">
                            <div class="card-body p-4">
                              <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                  <div class="icon-box bg-warning-subtle rounded-3 p-3 me-3">
                                    <i class="ti ti-subtask text-warning fs-4"></i>
                                  </div>
                                  <div>
                                    <h5 class="card-title mb-0 fw-semibold">
                                      <span id="actions-count" class="counter-value">0</span> Actions
                                    </h5>
                                  </div>
                                </div>
                                <div class="dropdown">
                                  <button class="btn btn-sm btn-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ti ti-dots-vertical"></i>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" id="add-action-dropdown">Add Action</a></li>
                                    <li><a class="dropdown-item" href="#" id="view-actions-dropdown">View All</a></li>
                                  </ul>
                                </div>
                              </div>
                              <p class="card-text text-muted mb-0">Tasks and follow-ups</p>
                              <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar bg-warning actions-progress-bar" role="progressbar" style="width: 0%"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          <!-- agenda Tab -->
          <div class="tab-pane fade h-100" id="agenda" role="tabpanel" aria-labelledby="agenda-tab">
            <div class="container-fluid h-100 pt-1">
              <div class="row h-100">
                <div class="col-12">
                  <div class="row">
                    <div class="col-lg-4">
                      <div class="row mb-4">
                        <div class="col-lg-8">
                          <form class="position-relative">
                            <input type="text" class="form-control border-primary search-agenda-point py-2 ps-5" id="search-agenda-point" placeholder="Search Agenda Points">
                            <i class="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                          </form>
                        </div>
                        <div class="col-lg-4">
                          <a href="javascript:void(0)" class="btn btn-gradient d-flex align-items-center justify-content-center h-100 w-100 py-2" id="add-agenda-point">
                          <i class="ti ti-list-details fs-4 me-2"></i>
                          <span class="d-none d-md-block fw-medium fs-3">Add</span>
                          </a>
                        </div>
                      </div>
                      <!-- agenda cards go here -->
                      <div class="all-agenda-points-outer">
                        <div id="all-agenda-points">
                        </div>
                      </div>
                    </div>
                    <!-- first half end -->
                    <div id="meenoe-agenda-details" class="col-lg-8">
                      <div class="position-relative overflow-hidden">
                        <div class="position-relative">
                          <div id="agenda-point-details" class="mh-n100 p-9" data-simplebar="init">
                            <div class="threads-list threads w-100" data-user-id="8">
                              <div class="hstack align-items-start mb-4 pb-1 align-items-center justify-content-between flex-wrap gap-6">
                                <div class="d-flex align-items-center gap-2">
                                  <div>
                                    <h4 id="agenda-point-title" class="agenda-point-title fw-semibold mb-2" style="cursor: text;">
                                      Provide an update on sales team
                                    </h4>
                                  </div>
                                </div>
                                <div class="setPointUrgency d-flex gap-2">
                                  <span id="details-urgency-pill" class="badge text-bg-primary">
                                  Important
                                  </span>
                                  <div class="dropdown disoc">
                                    <a class="fs-6 nav-icon-hover color-inherit" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ti ti-dots-vertical"></i>
                                    </a>
                                    <ul class="dropdown-menu" style="">
                                      <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom normal-urgency urgency-option" href="#" data-urgency="normal"><span><i class="ti ti-point-filled fs-5"></i>
                                        </span>Normal
                                        </a>
                                      </li>
                                      <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom moderate-urgency urgency-option" href="#" data-urgency="moderate"><span><i class="ti ti-point-filled fs-5 text-secondary"></i></span>Moderate</a>
                                      </li>
                                      <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom important-urgency urgency-option" href="#" data-urgency="important"><span><i class="ti ti-point-filled fs-5 text-primary"></i></span>Important</a>
                                      </li>
                                      <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom critical-urgency urgency-option" href="#" data-urgency="critical"><span><i class="ti ti-point-filled fs-5 text-warning"></i></span>Critical</a>
                                      </li>
                                      <li>
                                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom mandatory-urgency urgency-option" href="#" data-urgency="mandatory"><span><i class="ti ti-point-filled fs-5 text-danger"></i></span>Mandatory</a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div class="meenoethreadsouter">
                                <div class="meenoethreads w-100">
                                  <div class="hstack gap-3 align-items-start mb-7 justify-content-start agenda-thread-post">
                                    <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-8.jpg" alt="user8" width="40" height="40" class="rounded-circle comment-user-prof-img">
                                    <div class="">
                                      <h6 class="comment-username fs-2 text-muted">
                                        Andrew Tate
                                        <span class="comment-date-time">10:00 am, 2/22/2024</span>
                                      </h6>
                                      <div class="thread-text p-2 text-bg-thread rounded-1 d-inline-block text-dark fs-3">
                                        We achieved about 20% increases in our last week's performance by changing one line in the sales script. would love to share it with the team!
                                      </div>
                                      <div class="thread-actions d-flex align-items-center">
                                        <div class="d-flex align-items-center gap-2">
                                          <a class="edit-thread p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="edit">
                                          <i class="ti ti-edit fs-4 text-primary"></i>
                                          </a>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 ms-4">
                                          <a class="delete-thread p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Approve">
                                          <i class="ti ti-star text-muted fs-4"></i>
                                          </a>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 ms-4">
                                          <a class="delete-thread p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                          <i class="ti ti-trash text-danger fs-4"></i>
                                          </a>
                                        </div>
                                        <a class="connect-action text-dark ms-auto d-flex align-items-center justify-content-center bg-transparent p-2 fs-4 rounded-circle" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Create an action">
                                        <i class="ti ti-steam"></i>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="hstack gap-3 align-items-start mb-7 justify-content-start agenda-thread-post">
                                    <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-4.jpg" alt="user8" width="40" height="40" class="rounded-circle">
                                    <div class="">
                                      <h6 class="fs-2 text-muted">
                                        Sally, 1.8 hours ago
                                      </h6>
                                      <div class="p-2 text-bg-light rounded-1 d-inline-block text-dark fs-3">
                                        Amazing Andrew! we also have some pretty good results from our strats, though not as amazing as yours. can't wait to see it, wanna share your implementation file?
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="agendafiles">
                                <div class="mb-3">
                                  <div class="d-flex align-items-center justify-content-between">
                                    <ul class="list-unstyled mb-0 d-flex align-items-center gap-7">
                                      <li>
                                        <a id="agenda-add-thread" class="btn btn-light align-items-center meenoe-shadow d-flex gap-1" href="javascript:void(0)">
                                        <i class="ti ti-message-plus"></i>
                                        Add Thread
                                        </a>
                                      </li>
                                      <li>
                                        <a id="agenda-audio-clip" class="btn btn-light align-items-center meenoe-shadow d-flex gap-1" href="javascript:void(0)">
                                        <i class="ti ti-microphone"></i>
                                        Add Voice Clip
                                        </a>
                                      </li>
                                      <li>
                                        <a id="agenda-file-upload" class="btn btn-light align-items-center meenoe-shadow d-flex gap-1" href="javascript:void(0)">
                                        <i class="ti ti-file-upload"></i>
                                        Upload File
                                        </a>
                                      </li>
                                      <li>
                                        <a id="agenda-view-files" class="btn btn-light align-items-center meenoe-shadow d-flex gap-1"  data-bs-toggle="offcanvas" data-bs-target="#filesOffcanvas" aria-controls="filesOffcanvas">
                                        <i class="ti ti-paperclip"></i>
                                        View Files
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <!-- Files section is now hidden - files are shown in off-canvas -->
                                <div id="agenda-files-list" class="d-none">
                                  <!-- This div is now hidden as files are displayed in the off-canvas -->
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Actions Tab -->
          <div class="tab-pane transparentbg fade h-100" id="actions" role="tabpanel" aria-labelledby="actions-tab">
            <!-- actions -->
            <div id="meenoe-actions-section" class="p-3 mb-2">
              <ul class="nav nav-pills p-2 rounded align-items-center flex-row">
                <div class="card-actions cursor-pointer ms-auto d-flex button-group gap-3 disoc">
                  <a class="btn btn-gradient d-flex align-items-center px-3 gap-6" id="meenoe-action-template disoc">
                  <i class="ti ti-template fs-4"></i>
                  <span class="d-none d-md-block font-weight-medium fs-3">Use Action Template</span>
                  </a>
                  <a class="btn btn-gradient d-flex align-items-center px-3 gap-6 disoc" id="meenoe-add-action">
                  <i class="ti ti-subtask fs-4"></i>
                  <span class="d-none d-md-block font-weight-medium fs-3">Add Action</span>
                  </a>
                  <!-- actions drop down -->
                  <div class="dropdown d-inline-flex align-items-center justify-content-center disoc">
                    <a class="color-inherit fs-6 nav-icon-hover" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ti ti-dots-vertical"></i>
                    </a>
                    <ul class="dropdown-menu" style="">
                      <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom" href="javascript:void(0)" onclick="expand_all()">
                        <span>
                        <i class="ti ti-circle-plus fs-4"></i>
                        </span>
                        Expand Branches
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item d-flex align-items-center gap-2 border-bottom" href="javascript:void(0)" onclick="collapse_all()">
                        <span>
                        <i class="ti ti-circle-minus fs-4"></i>
                        </span>
                        Collapse Branches
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item d-flex align-items-center gap-2" href="javascript:void(0)" data-action="collapse-all">
                        <i class="ti ti-minus fs-4"></i>
                        <span>
                        Close all cards
                        </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <!-- actions drop down end -->
                </div>
              </ul>
              <!-- empty agenda list end -->
            </div>
            <div id="meenoe-actions">
              <!--  Row 2 action flow -->
              <div id="div_tree" class="w-100 mx-auto">
                <!-- empty agenda list graphic here -->
                <div id="zero-actions" class="card shadow-none">
                  <div class="card-body text-center">
                    <img src="img/nothingfound2.svg" alt="no-action" class="img-fluid mb-4" width="130">
                    <h6 class="fs-3 mb-3">There are no actions in this Meenoe, let's add some!</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Running Page Layout -->
      <div class="layout-running-page d-none">
        <div class="container-fluid h-100 p-0">
          <div class="h-100 overflow-auto">
            <div id="running-details" class="mb-5">
              <!-- Details content will be moved here -->
            </div>
            <div id="running-flow" class="mb-5">
              <!-- Flow content will be moved here -->
            </div>
            <div id="running-actions">
              <!-- Actions content will be moved here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
<!-- Add User Modal -->
<div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header flex-column align-items-start border-0 pb-0">
        <div class="d-flex justify-content-between w-100 align-items-center mb-3">
          <h5 class="modal-title" id="addUserModalLabel">People</h5>
          <div class="d-flex align-items-center">
            <div class="input-group input-group-sm me-3" style="width: 250px;">
              <input type="text" class="form-control" id="userSearchInput" placeholder="Search by name">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
        <!-- Controls Toolbar for Modal -->
        <div class="modal-controls-toolbar d-flex justify-content-between align-items-center w-100 pt-2 pb-3 mb-3">
          <div>
            <button class="btn btn-sm btn-outline-primary me-2">Design Team <i class="bi bi-chevron-down ms-1"></i></button>
            <button class="btn btn-sm btn-outline-secondary me-2" id="modalSortOrderButton">Position <i class="bi bi-arrow-down-up ms-1"></i></button>
          </div>
          <div class="d-flex align-items-center">
            <span class="text-muted me-2 small">Sort by:</span>
            <select class="form-select form-select-sm me-2" style="width: auto;" id="modalSortBySelect">
              <option value="name" selected>Name</option>
              <option value="progress">Progress</option>
            </select>
            <div class="btn-group btn-group-sm" role="group" id="modalLayoutToggle">
              <button type="button" class="btn btn-outline-secondary active"><i class="bi bi-grid-3x3-gap-fill"></i></button>
              <button type="button" class="btn btn-outline-secondary"><i class="bi bi-list-ul"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="row" id="modalUserList">
          <!-- User cards will be populated here by JavaScript -->
        </div>
      </div>
      <div class="modal-footer justify-content-between flex-wrap">
        <div class="w-100 mb-2">
          <div id="guestPillContainer" class="guest-pill-container mb-2">
            <!-- Guest pills will be added here by JavaScript -->
          </div>
          <div class="input-group">
            <input type="email" class="form-control form-control-sm" id="guestEmailInput" placeholder="Invite guest by email">
            <button class="btn btn-sm btn-outline-secondary" type="button" id="inviteGuestButton">Invite</button>
            <select class="form-select form-select-sm" id="guestPermissionSelect" style="max-width: 120px;">
              <option value="viewer" selected>Viewer</option>
              <option value="contributor">Contributor</option>
            </select>
          </div>
        </div>
        <button type="button" class="btn btn-primary" id="addSelectedUsersButton">Add people</button>
      </div>
    </div>
  </div>
</div>
<!-- Action Users Modal -->
<div class="modal fade" id="actionUsersModal" tabindex="-1" aria-labelledby="actionUsersModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header flex-column align-items-start border-0 pb-0">
        <div class="d-flex justify-content-between w-100 align-items-center mb-3">
          <h5 class="modal-title" id="actionUsersModalLabel">Manage Action Users</h5>
          <div class="d-flex align-items-center">
            <div class="input-group input-group-sm me-3" style="width: 250px;">
              <input type="text" class="form-control" id="actionUserSearchInput" placeholder="Search by name">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
        <div class="w-100">
          <p class="text-muted mb-0">Select users who will be responsible for this action and set their permissions</p>
        </div>
      </div>
      <div class="modal-body">
        <div id="actionUserList" class="row">
          <!-- User cards will be populated here by JavaScript -->
        </div>
        <div id="noUsersMessage" class="text-center text-muted py-4 d-none">
          <i class="ti ti-users-off fs-1"></i>
          <h6 class="mt-2">No Users Available</h6>
          <p class="small">Add users to this meeting first to assign them to actions.</p>
          <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#addUserModal">
          Add Users to Meeting
          </button>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <div class="d-flex align-items-center">
          <small class="text-muted">
          <i class="ti ti-info-circle me-1"></i>
          Permissions control what users can do with this action
          </small>
        </div>
        <div>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="saveActionUsersButton">Save Users</button>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Link Agenda Modal -->
<div class="modal fade" id="L-A-modal" tabindex="-1" aria-labelledby="linkAgendaModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="linkAgendaModalLabel">Link Agenda Point</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="linked-agenda-modalBody">
        <div class="mb-3">
          <p class="text-muted">Select an agenda point to link with this action:</p>
        </div>
        <div class="agenda-search-container mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="ti ti-search"></i></span>
            <input type="text" class="form-control border-primary" id="agendaSearchInput" placeholder="Search agenda points...">
          </div>
        </div>
        <ul class="list-group" id="linked-agenda-list">
          <!-- Agenda points will be populated here by JavaScript -->
        </ul>
        <div id="noAgendaMessage" class="text-center text-muted py-4 d-none">
          <i class="ti ti-clipboard-off fs-1"></i>
          <h6 class="mt-2">No Agenda Points Available</h6>
          <p class="small">Create some agenda points first to link them to actions.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="setButton" disabled>Link Selected</button>
      </div>
    </div>
  </div>
</div>
<!-- Files Off-canvas -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="filesOffcanvas" aria-labelledby="filesOffcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="filesOffcanvasLabel">
      <i class="ti ti-paperclip me-2"></i>Files
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div id="files-chat-container" class="files-chat">
      <!-- Files will be populated here by JavaScript -->
      <div class="text-center py-5" id="no-files-message">
        <i class="ti ti-file-off fs-1 text-muted"></i>
        <p class="mt-2 text-muted">No files uploaded yet.</p>
      </div>
    </div>
  </div>
</div>
<!-- Floating AI Assistant Button -->
<button id="aiAssistantButton" class="ai-assistant-btn" data-bs-toggle="offcanvas" data-bs-target="#aichatoffcanvas" aria-controls="aichatoffcanvas">
  <i class="ti ti-sparkles fs-5"></i>
</button>

  <!-- ai chat off canvas -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="aichatoffcanvas" data-bs-scroll="true" aria-labelledby="aichatoffcanvasLabel">
  <!-- Floating close button -->
  <button type="button" class="btn-close floating-close" data-bs-dismiss="offcanvas" aria-label="Close">
    <i class="ti ti-x"></i>
  </button>

  <div id="app">
    <div class="chat-container">
<div class="chat-header">
        <div class="header-right d-flex align-items-center">
          <button id="clear-chat" class="icon-button">
            <i class="ti ti-message-plus"></i>
            New Chat
          </button>
          <button id="ai-settings-btn" class="icon-button ms-2" type="button" title="AI Settings" data-bs-toggle="tooltip" data-bs-title="AI Settings">
            <i class="ti ti-settings"></i>
          </button>
        </div>
      </div>
      <div class="chat-content">
        <div class="chat-main">
          <div id="chat-messages"></div>
          <div id="chat-input">
            <div id="knowledge-base-toggle" class="dropup position-absolute">
              <button class="btn btn-dark rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="ti ti-paperclip"></i>
              </button>
              <ul class="dropdown-menu">
                <div class="files-sidebar">
                  <div class="files-header">
                    <h3>Knowledge Base</h3>
                    <div class="file-search">
                      <input type="text" id="file-search" placeholder="Search files...">
                    </div>
                  </div>
                  <div id="files-list"></div>
                </div>
              </ul>
            </div>
            <div class="chat-input-wrapper">
              <button id="upload-file" class="icon-button">
              <i class="ti ti-plus"></i>
              </button>
              <textarea id="user-input" rows="1" placeholder="Type your message..."></textarea>
              <button id="micButton">
              <i class="ti ti-microphone"></i>
              </button>
              <button id="send-button" class="icon-button">
              <i class="ti ti-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Meenoe Details Styles -->
<style>
/* Editing states for meenoe details */
.editing {
    background-color: #fff3cd !important;
    border: 2px dashed #ffc107 !important;
    border-radius: 8px !important;
    padding: 8px !important;
    outline: none !important;
    transition: all 0.3s ease;
}

.editing:focus {
    background-color: #fff !important;
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

/* Counter animation */
.counter-value {
    transition: transform 0.3s ease, color 0.3s ease;
    display: inline-block;
    font-weight: 600;
}

/* At-a-glance card styles */
.hover-shadow {
    transition: all 0.3s ease;
}

.hover-shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.card:hover .icon-box {
    transform: scale(1.1);
}

.btn-icon {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: transparent;
    color: #6c757d;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    background-color: #f8f9fa;
    color: #0d6efd;
}

/* Name syncing visual feedback */
#meenoe-name2 input {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

#meenoe-name2 input:focus {
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.name-syncing {
    animation: syncPulse 0.5s ease-in-out;
}

@keyframes syncPulse {
    0% { background-color: transparent; }
    50% { background-color: rgba(13, 110, 253, 0.1); }
    100% { background-color: transparent; }
}

/* Edit button states */
#edit-meenoe-name.btn-success,
#edit-objective.text-success {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

/* Progress bar animations */
.progress-bar {
    transition: width 1s ease-in-out;
}
</style>
    `;

    // Load all the create new page specific scripts
    loadCreateNewScripts();

    // Attach AI Settings button handler after DOM is updated
    setTimeout(() => {
      const aiSettingsBtn = document.getElementById('ai-settings-btn');
      if (aiSettingsBtn) {
        aiSettingsBtn.addEventListener('click', () => {
          if (window.AIChatIntegration && typeof window.AIChatIntegration.showSettings === 'function') {
            window.AIChatIntegration.showSettings();
          } else if (typeof showAISettingsModal === 'function') {
            showAISettingsModal();
          }
        });
        // Initialize tooltip if Bootstrap is loaded
        if (window.bootstrap && window.bootstrap.Tooltip) {
          new window.bootstrap.Tooltip(aiSettingsBtn);
        }
      }
    }, 200);

    // Ensure Bootstrap event delegation is re-initialized for dynamic content
    if (typeof handleDynamicComponents === "function") {
        handleDynamicComponents();
    }

    // Initialize people modal with event delegation for dynamic content
    if (typeof window.initializePeopleModal === "function") {
        window.initializePeopleModal();
    }
}

// Track loaded scripts to prevent duplicates
window.createNewScriptsLoaded = window.createNewScriptsLoaded || new Set();

function loadCreateNewScripts() {
    const scripts = [
        '/src/js/create-new/edgeTTS.js',
        '/src/js/create-new/action-users.js',
        '/src/js/create-new/agendaflow.js',
        '/src/js/create-new/ai-system-loader.js',
        '/src/js/create-new/ai-chat-integration.js',
        '/src/js/create-new/bootstrap-init.js',
        '/src/js/create-new/datepicker.js',
        '/src/js/create-new/file-drop.js',
        '/src/js/create-new/layout-manager.js',
        '/src/js/create-new/meenoeactions.js',
        '/src/js/create-new/meenoeInit.js',
        '/src/js/create-new/people-modal.js',
        '/src/js/create-new/publishing-status.js',
        '/src/js/create-new/Sortable.min.js',
        '/src/js/create-new/utils.js',
        '/src/js/create-new/waveform-audio-player.js',
        '/src/js/create-new/meenoe-state.js',
        '/src/js/create-new/meenoe-details.js',
        '/src/js/create-new/meenoe-integrations.js',
        '/src/js/create-new/at-a-glance-cards.js'
    ];

    // Check if scripts are already loaded
    const scriptsToLoad = scripts.filter(script => !window.createNewScriptsLoaded.has(script));

    if (scriptsToLoad.length === 0) {
        // Double-check that key components are available
        const agendaFlowReady = typeof window.agendaFlow !== 'undefined';
        const layoutManagerReady = typeof layoutContainer !== 'undefined';

        if (agendaFlowReady && layoutManagerReady) {
            initializeCreateNewInterface();
        } else {
            // Force reload of critical scripts if components aren't available
            const criticalScripts = scripts.filter(script =>
                (script.includes('agendaflow.js') && !agendaFlowReady) ||
                (script.includes('layout-manager.js') && !layoutManagerReady)
            );
            if (criticalScripts.length > 0) {
                loadScriptsSequentially(criticalScripts, 0);
            } else {
                initializeCreateNewInterface();
            }
        }
        return;
    }

    // Load scripts sequentially
    loadScriptsSequentially(scriptsToLoad, 0);
}

function loadScriptsSequentially(scripts, index) {
    if (index >= scripts.length) {
        // All scripts loaded, initialize the create new interface
        console.log('✅ All Create New scripts loaded successfully!');
        initializeCreateNewInterface();
        return;
    }

    // Check if script element already exists in DOM
    const existingScript = document.querySelector(`script[data-script-src="${scripts[index]}"]`);
    if (existingScript) {
        // Mark as loaded and continue
        window.createNewScriptsLoaded.add(scripts[index]);
        loadScriptsSequentially(scripts, index + 1);
        return;
    }

    const script = document.createElement('script');
    script.src = scripts[index];
    script.setAttribute('data-script-src', scripts[index]);

    script.onload = () => {
        // Mark script as loaded
        window.createNewScriptsLoaded.add(scripts[index]);

        // Special handling for agendaflow.js
        if (scripts[index].includes('agendaflow.js')) {
            // Give a small delay to ensure the script is fully executed
            setTimeout(() => {
                if (window.agendaFlow && window.agendaFlow.reinitializeForDynamicContent) {
                    window.agendaFlow.reinitializeForDynamicContent();
                }
            }, 50);
        }

        loadScriptsSequentially(scripts, index + 1);
    };
    script.onerror = () => {
        loadScriptsSequentially(scripts, index + 1);
    };

    document.head.appendChild(script);
}

function initializeCreateNewInterface() {
    // Initialize the Meenoe Actions tree (fix for dynamic SPA navigation)
    if (typeof window.initMeenoeTree === "function") {
        window.initMeenoeTree();
    }

    // Reinitialize AgendaFlow for dynamic content with a delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof window.agendaFlow !== 'undefined' && window.agendaFlow.reinitializeForDynamicContent) {
            window.agendaFlow.reinitializeForDynamicContent();

            // Force check for agenda points container after reinitialization
            const agendaContainer = document.getElementById('all-agenda-points');
            if (agendaContainer) {
                // Agenda points container found
            }
        }
    }, 200);

    // Initialize event handlers after DOM is ready
    setTimeout(() => {
        initializeEventHandlers();
    }, 100);

    // Ensure people modal event delegation is always initialized after DOM is ready
    setTimeout(() => {
        if (typeof window.initializePeopleModal === "function") {
            window.initializePeopleModal();
        }
    }, 150);

    // Initialize meenoe state management and details functionality
    setTimeout(() => {
        if (window.meenoeState) {
            window.meenoeState.refreshAllCounters();
        }
        if (window.meenoeDetails) {
            window.meenoeDetails.reinitialize();
        }
        if (window.meenoeIntegrations) {
            window.meenoeIntegrations.syncNow();
        }
        if (window.atAGlanceCards) {
            window.atAGlanceCards.reinitialize();
        }
        
        // Initialize progress bars based on current counts
        updateProgressBars();
    }, 300);
    
    // Set up dropdown action handlers for at-a-glance cards
    setupAtAGlanceCardActions();
}

function updateProgressBars() {
    // Get current counts with null checks
    const userCountElement = document.getElementById('users-count');
    const agendaCountElement = document.getElementById('agenda-count');
    const filesCountElement = document.getElementById('files-count');
    const actionsCountElement = document.getElementById('actions-count');
    
    if (!userCountElement || !agendaCountElement || !filesCountElement || !actionsCountElement) {
        console.warn('Progress bar count elements not found');
        return;
    }
    
    const userCount = parseInt(userCountElement.textContent) || 0;
    const agendaCount = parseInt(agendaCountElement.textContent) || 0;
    const filesCount = parseInt(filesCountElement.textContent) || 0;
    const actionsCount = parseInt(actionsCountElement.textContent) || 0;
    
    // Set progress percentages based on counts (with a max value for 100%)
    const maxUsers = 10;
    const maxAgenda = 15;
    const maxFiles = 20;
    const maxActions = 25;
    
    // Calculate percentages
    const userPercent = Math.min(100, (userCount / maxUsers) * 100);
    const agendaPercent = Math.min(100, (agendaCount / maxAgenda) * 100);
    const filesPercent = Math.min(100, (filesCount / maxFiles) * 100);
    const actionsPercent = Math.min(100, (actionsCount / maxActions) * 100);
    
    // Update progress bars with null checks and specific class selectors
    const usersProgressBar = document.querySelector('.users-progress-bar');
    const agendaProgressBar = document.querySelector('.agenda-progress-bar');
    const filesProgressBar = document.querySelector('.files-progress-bar');
    const actionsProgressBar = document.querySelector('.actions-progress-bar');
    
    if (usersProgressBar) {
        usersProgressBar.style.width = `${userPercent}%`;
    }
    if (agendaProgressBar) {
        agendaProgressBar.style.width = `${agendaPercent}%`;
    }
    if (filesProgressBar) {
        filesProgressBar.style.width = `${filesPercent}%`;
    }
    if (actionsProgressBar) {
        actionsProgressBar.style.width = `${actionsPercent}%`;
    }
}

function setupAtAGlanceCardActions() {
    // Add Users dropdown actions
    document.getElementById('add-users-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const addUserButton = document.getElementById('addUserButton');
        if (addUserButton) {
            addUserButton.click();
        }
    });
    
    // Add Agenda dropdown actions
    document.getElementById('add-agenda-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Switch to agenda tab
        const agendaTab = document.getElementById('agenda-tab');
        if (agendaTab) {
            agendaTab.click();
            // After tab switch, click the add agenda button
            setTimeout(() => {
                const addAgendaButton = document.getElementById('add-agenda-point');
                if (addAgendaButton) {
                    addAgendaButton.click();
                }
            }, 300);
        }
    });
    
    document.getElementById('view-agenda-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const agendaTab = document.getElementById('agenda-tab');
        if (agendaTab) {
            agendaTab.click();
        }
    });
    
    // Add Files dropdown actions
    document.getElementById('upload-files-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const agendaTab = document.getElementById('agenda-tab');
        if (agendaTab) {
            agendaTab.click();
            // After tab switch, click the file upload button
            setTimeout(() => {
                const fileUploadButton = document.getElementById('agenda-file-upload');
                if (fileUploadButton) {
                    fileUploadButton.click();
                }
            }, 300);
        }
    });
    
    document.getElementById('view-files-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const viewFilesButton = document.getElementById('agenda-view-files');
        if (viewFilesButton) {
            viewFilesButton.click();
        }
    });
    
    // Add Actions dropdown actions
    document.getElementById('add-action-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
            actionsTab.click();
            // After tab switch, click the add action button
            setTimeout(() => {
                const addActionButton = document.getElementById('meenoe-add-action');
                if (addActionButton) {
                    addActionButton.click();
                }
            }, 300);
        }
    });
    
    document.getElementById('view-actions-dropdown')?.addEventListener('click', (e) => {
        e.preventDefault();
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
            actionsTab.click();
        }
    });
}

function initializeEventHandlers() {
    // Add tab switching event listener to handle AgendaFlow reinitialization
    initializeTabSwitchHandlers();

    // Initialize other event handlers
    initializeDetailsTabHandlers();
    initializeActionsTabHandlers();
}

function initializeTabSwitchHandlers() {
    // Listen for tab switching events
    document.addEventListener('shown.bs.tab', function (e) {
        const targetTab = e.target.getAttribute('aria-controls');
        console.log('🔄 Tab switched to:', targetTab);

        if (targetTab === 'flow') {
            console.log('📋 Flow tab activated, checking AgendaFlow...');

            // Give a small delay for the tab content to be visible
            setTimeout(() => {
                const agendaContainer = document.getElementById('all-agenda-points');
                if (agendaContainer) {
                    console.log('✅ Agenda container found, children:', agendaContainer.children.length);

                    // If AgendaFlow is available and container is empty, reinitialize
                    if (window.agendaFlow && agendaContainer.children.length === 0) {
                        console.log('🔄 Reinitializing AgendaFlow for empty container...');
                        window.agendaFlow.reinitializeForDynamicContent();
                    }
                } else {
                    console.warn('⚠️ Agenda container not found in Flow tab');
                }
            }, 100);
        }
    });

}



function initializeDetailsTabHandlers() {
    // Title edit logic
    const titleInput = document.getElementById('meenoeTitleInput');
    const editTitleBtn = document.getElementById('editMeenoeTitleBtn');
    
    if (titleInput && editTitleBtn) {
        editTitleBtn.addEventListener('click', () => {
            if (titleInput.readOnly) {
                titleInput.readOnly = false;
                titleInput.focus();
                editTitleBtn.innerHTML = '<i class="bi bi-check"></i> Save';
            } else {
                titleInput.readOnly = true;
                editTitleBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit';
            }
        });
    }
    
    // Session type logic
    const sessionTypeOptions = document.querySelectorAll('.session-type-pill');
    const selectedSessionTypes = document.getElementById('selectedSessionTypes');
    const addSessionTypeBtn = document.getElementById('addSessionTypeBtn');
    const customSessionTypeInput = document.getElementById('customSessionTypeInput');
    
    if (sessionTypeOptions.length > 0 && selectedSessionTypes && addSessionTypeBtn && customSessionTypeInput) {
        function addSessionTypeTag(type) {
            if ([...selectedSessionTypes.children].some(child => child.textContent.includes(type))) return;
            const tag = document.createElement('span');
            tag.className = 'badge rounded-pill bg-primary text-white px-3 py-2 d-flex align-items-center gap-2';
            tag.textContent = type;
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-close btn-close-white btn-sm ms-2';
            removeBtn.style.fontSize = '0.7rem';
            removeBtn.onclick = () => tag.remove();
            tag.appendChild(removeBtn);
            selectedSessionTypes.appendChild(tag);
        }
        
        sessionTypeOptions.forEach(btn => {
            btn.addEventListener('click', () => addSessionTypeTag(btn.dataset.type));
        });
        
        addSessionTypeBtn.addEventListener('click', () => {
            const val = customSessionTypeInput.value.trim();
            if (val) {
                addSessionTypeTag(val);
                customSessionTypeInput.value = '';
            }
        });
        
        customSessionTypeInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                addSessionTypeBtn.click();
            }
        });
        
    }
}

function initializeActionsTabHandlers() {
    // Add Action button
    // Handler is now managed in meenoeInit.js to prevent duplicate actions.
}

function createTestAction() {
    const actionsContainer = document.getElementById('div_tree');
    const zeroActions = document.getElementById('zero-actions');

    if (actionsContainer) {
        // Hide the "no actions" message
        if (zeroActions) {
            zeroActions.style.display = 'none';
        }

        const testAction = document.createElement('div');
        testAction.className = 'card mb-3';
        testAction.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">Test Action ${Date.now()}</h6>
                <p class="card-text small text-muted">This is a test action created at ${new Date().toLocaleTimeString()}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-warning">Open</span>
                    <small class="text-muted">No assignee</small>
                </div>
            </div>
        `;
        actionsContainer.appendChild(testAction);
    }
}

// Cleanup function to call when leaving the page
function cleanupCreateNewPage() {
    // Remove any event listeners or intervals that might be running
    if (window.agendaFlow && window.agendaFlow.cleanup) {
        window.agendaFlow.cleanup();
    }

    // Call AgendaFlow cleanup if available
    if (typeof window.agendaFlowCleanup === 'function') {
        window.agendaFlowCleanup();
    }

    // Cleanup meenoe state management systems
    if (window.meenoeState && window.meenoeState.cleanup) {
        window.meenoeState.cleanup();
    }

    if (window.meenoeDetails && window.meenoeDetails.cleanup) {
        window.meenoeDetails.cleanup();
    }

    if (window.meenoeIntegrations && window.meenoeIntegrations.cleanup) {
        window.meenoeIntegrations.cleanup();
    }

    if (window.atAGlanceCards && window.atAGlanceCards.cleanup) {
        window.atAGlanceCards.cleanup();
    }

    // Clear any timeouts or intervals
    // Note: Individual modules should handle their own cleanup

    // Optional: Remove script tags to prevent accumulation (commented out for now)
    // This could be enabled if we want to completely clean up scripts
    /*
    const createNewScripts = document.querySelectorAll('script[data-script-src*="/create-new/"]');
    createNewScripts.forEach(script => {
        script.remove();
    });
    window.createNewScriptsLoaded.clear();
    */
}

// Export functions for global access
window.createNewPage = {
    loadPage: loadCreateNew,
    initializeInterface: initializeCreateNewInterface,
    cleanup: cleanupCreateNewPage
};
