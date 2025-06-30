// My Files page functionality with file upload and AI chat
class FileManager {
    constructor() {
        this.files = {
            personal: this.getDummyPersonalFiles(),
            organization: this.getDummyOrganizationFiles()
        };
        this.currentType = null;
        this.currentTab = 'files';
        this.uploadProgress = new Map();
        this.storageUsed = {
            personal: 2.4, // GB
            organization: 8.7 // GB
        };
        this.storageLimit = {
            personal: 10, // GB
            organization: 50 // GB
        };
        this.isDragging = false;
        this.init();
    }

    init() {
        console.log('File Manager initialized');
    }

    getDummyPersonalFiles() {
        return [
            {
                id: 'file_001',
                name: 'modernbert.docx',
                type: 'docx',
                size: '2.27 MB',
                uploadDate: '2024-01-15',
                status: 'processed',
                icon: 'ti-file-text',
                color: 'primary'
            },
            {
                id: 'file_002',
                name: 'Project Proposal.pdf',
                type: 'pdf',
                size: '4.8 MB',
                uploadDate: '2024-01-14',
                status: 'processed',
                icon: 'ti-file-text',
                color: 'danger'
            },
            {
                id: 'file_003',
                name: 'Budget Analysis.xlsx',
                type: 'xlsx',
                size: '3.1 MB',
                uploadDate: '2024-01-13',
                status: 'processing',
                icon: 'ti-file-spreadsheet',
                color: 'success'
            }
        ];
    }

    getDummyOrganizationFiles() {
        return [
            {
                id: 'org_file_001',
                name: 'Company Handbook.pdf',
                type: 'pdf',
                size: '5.2 MB',
                uploadDate: '2024-01-10',
                status: 'processed',
                icon: 'ti-file-text',
                color: 'danger',
                uploadedBy: 'HR Team'
            },
            {
                id: 'org_file_002',
                name: 'Q4 Financial Report.pdf',
                type: 'pdf',
                size: '8.7 MB',
                uploadDate: '2024-01-08',
                status: 'processed',
                icon: 'ti-file-text',
                color: 'danger',
                uploadedBy: 'Finance Team'
            },
            {
                id: 'org_file_003',
                name: 'Product Roadmap.pptx',
                type: 'pptx',
                size: '12.3 MB',
                uploadDate: '2024-01-05',
                status: 'processed',
                icon: 'ti-presentation',
                color: 'warning',
                uploadedBy: 'Product Team'
            }
        ];
    }

    renderFilesPage(type) {
        this.currentType = type;
        const isPersonal = type === 'personal';
        const files = this.files[type];
        const storageUsed = this.storageUsed[type];
        const storageLimit = this.storageLimit[type];
        const storagePercentage = (storageUsed / storageLimit) * 100;

        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="container-fluid p-4 fade-in">
                <!-- Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <button class="btn btn-outline-secondary me-3" onclick="window.router.navigate('my-files')">
                                    <i class="ti ti-arrow-left me-2"></i>
                                    Back
                                </button>
                                <div>
                                    <h1 class="h3 mb-1">${isPersonal ? 'Personal' : 'Organization'} Files</h1>
                                    <p class="text-muted mb-0">${isPersonal ? 'Your personal knowledge base' : 'Shared organization knowledge base'}</p>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <div class="position-relative">
                                    <input type="text" class="form-control" placeholder="Search files..." style="width: 250px; padding-right: 40px;">
                                    <i class="ti ti-search position-absolute" style="right: 12px; top: 50%; transform: translateY(-50%); color: #6c757d;"></i>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        <i class="ti ti-filter me-2"></i>Filter
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">All Files</a></li>
                                        <li><a class="dropdown-item" href="#">PDFs</a></li>
                                        <li><a class="dropdown-item" href="#">Documents</a></li>
                                        <li><a class="dropdown-item" href="#">Spreadsheets</a></li>
                                        <li><a class="dropdown-item" href="#">Presentations</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="row mb-4">
                    <div class="col-12">
                        <ul class="nav nav-pills nav-fill bg-light rounded p-1">
                            <li class="nav-item">
                                <button class="nav-link ${this.currentTab === 'files' ? 'active' : ''} tab-btn" data-tab="files">
                                    <i class="ti ti-folder me-2"></i>
                                    Files & Documents
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link ${this.currentTab === 'chat' ? 'active' : ''} tab-btn" data-tab="chat">
                                    <i class="ti ti-message-circle me-2"></i>
                                    AI Chat
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Files Tab -->
                    <div class="tab-pane ${this.currentTab === 'files' ? 'show active' : ''}" id="files-tab">
                        <!-- Action Cards -->
                        <div class="row mb-4">
                            <!-- Upload Card -->
                            <div class="col-md-6 mb-3">
                                <div class="upload-card card border-0 shadow-sm h-100" id="upload-area">
                                    <div class="card-body text-center p-5">
                                        <div class="upload-visual mb-4">
                                            <div class="upload-icon-container">
                                                <div class="upload-icon-bg">
                                                    <i class="ti ti-cloud-upload upload-icon"></i>
                                                </div>
                                                <div class="upload-plus-icon">
                                                    <i class="ti ti-plus"></i>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="upload-content">
                                            <h5 class="upload-title mb-2">Upload & Process Files</h5>
                                            <p class="upload-subtitle text-muted mb-4">
                                                Drag and drop files here, or 
                                                <span class="upload-browse-text">browse</span>
                                            </p>
                                            
                                            <div class="upload-actions mb-4">
                                                <button class="btn btn-primary btn-lg upload-btn px-4">
                                                    <i class="ti ti-upload me-2"></i>
                                                    Choose Files
                                                </button>
                                            </div>
                                            
                                            <div class="upload-info">
                                                <div class="supported-formats mb-2">
                                                    <small class="text-muted">Supported formats:</small>
                                                </div>
                                                <div class="format-badges">
                                                    <span class="badge bg-light text-dark me-1">PDF</span>
                                                    <span class="badge bg-light text-dark me-1">DOC</span>
                                                    <span class="badge bg-light text-dark me-1">DOCX</span>
                                                    <span class="badge bg-light text-dark me-1">TXT</span>
                                                    <span class="badge bg-light text-dark me-1">PPT</span>
                                                    <span class="badge bg-light text-dark me-1">XLS</span>
                                                </div>
                                                <div class="upload-limits mt-2">
                                                    <small class="text-muted">Maximum file size: 50MB</small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <input type="file" class="d-none" id="file-upload" multiple accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx">
                                    </div>
                                    
                                    <!-- Drag Overlay -->
                                    <div class="drag-overlay" id="drag-overlay">
                                        <div class="drag-content">
                                            <i class="ti ti-upload drag-icon"></i>
                                            <h5 class="drag-title">Drop files here</h5>
                                            <p class="drag-subtitle">Release to upload</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Storage Card -->
                            <div class="col-md-6 mb-3">
                                <div class="card border-0 shadow-sm h-100">
                                    <div class="card-body p-4">
                                        <div class="d-flex align-items-center mb-4">
                                            <div class="storage-icon bg-gradient-primary p-3 rounded-3 me-3">
                                                <i class="ti ti-database text-white" style="font-size: 1.5rem;"></i>
                                            </div>
                                            <div>
                                                <h5 class="card-title mb-1">Storage Usage</h5>
                                                <p class="text-muted mb-0">Monitor your storage consumption</p>
                                            </div>
                                        </div>
                                        
                                        <div class="storage-stats mb-4">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span class="storage-used">${storageUsed} GB used</span>
                                                <span class="storage-total text-muted">${storageLimit} GB total</span>
                                            </div>
                                            
                                            <div class="progress storage-progress mb-3" style="height: 12px;">
                                                <div class="progress-bar ${storagePercentage > 80 ? 'bg-danger' : storagePercentage > 60 ? 'bg-warning' : 'bg-success'}" 
                                                     style="width: ${storagePercentage}%"></div>
                                            </div>
                                            
                                            <div class="storage-details">
                                                <div class="row text-center">
                                                    <div class="col-4">
                                                        <div class="storage-metric">
                                                            <h6 class="metric-value text-primary">${Math.round(storagePercentage)}%</h6>
                                                            <small class="metric-label text-muted">Used</small>
                                                        </div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="storage-metric">
                                                            <h6 class="metric-value text-success">${(storageLimit - storageUsed).toFixed(1)} GB</h6>
                                                            <small class="metric-label text-muted">Available</small>
                                                        </div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="storage-metric">
                                                            <h6 class="metric-value text-info">${files.length}</h6>
                                                            <small class="metric-label text-muted">Files</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        ${storagePercentage > 80 ? `
                                            <div class="alert alert-warning alert-sm mb-0">
                                                <i class="ti ti-alert-triangle me-2"></i>
                                                <small>Storage is running low. Consider upgrading your plan.</small>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Files Grid -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-header bg-white border-0 pb-0">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="card-title mb-0">Documents <span class="badge bg-secondary">${files.length}</span></h6>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-sm btn-outline-secondary view-toggle active" data-view="grid">
                                                    <i class="ti ti-grid-dots"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-secondary view-toggle" data-view="list">
                                                    <i class="ti ti-list"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body files-container-wrapper">
                                        <div id="files-container" class="files-grid">
                                            ${this.renderFilesGrid(files)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Tab -->
                    <div class="tab-pane ${this.currentTab === 'chat' ? 'show active' : ''}" id="chat-tab">
                        ${this.renderChatInterface(type)}
                    </div>
                </div>
            </div>

            <style>
                /* Upload Card Styles */
                .upload-card {
                    position: relative;
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    overflow: hidden;
                }

                .upload-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    z-index: 1;
                }

                .upload-card .card-body {
                    position: relative;
                    z-index: 2;
                }

                .upload-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3) !important;
                }

                .upload-card.drag-over {
                    transform: scale(1.02);
                    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4) !important;
                }

                /* Upload Visual Elements */
                .upload-visual {
                    position: relative;
                }

                .upload-icon-container {
                    position: relative;
                    display: inline-block;
                }

                .upload-icon-bg {
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    transition: all 0.3s ease;
                }

                .upload-icon {
                    font-size: 2.5rem;
                    color: white;
                }

                .upload-plus-icon {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #28a745;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 0.875rem;
                    border: 2px solid white;
                }

                .upload-card:hover .upload-icon-bg {
                    transform: scale(1.1);
                    background: rgba(255, 255, 255, 0.3);
                }

                /* Upload Content */
                .upload-title {
                    color: white;
                    font-weight: 600;
                    font-size: 1.25rem;
                }

                .upload-subtitle {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1rem;
                }

                .upload-browse-text {
                    color: white;
                    text-decoration: underline;
                    cursor: pointer;
                    font-weight: 500;
                }

                .upload-btn {
                    background: white;
                    color: #667eea;
                    border: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .upload-btn:hover {
                    background: #f8f9fa;
                    color: #5a67d8;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                /* Format Badges */
                .format-badges .badge {
                    background: rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    font-weight: 500;
                    padding: 0.375rem 0.75rem;
                    margin: 0.125rem;
                }

                /* Drag Overlay */
                .drag-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(40, 167, 69, 0.95);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .drag-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .drag-content {
                    text-align: center;
                    color: white;
                }

                .drag-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    animation: bounce 1s infinite;
                }

                .drag-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .drag-subtitle {
                    font-size: 1rem;
                    opacity: 0.9;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                /* Storage Card Enhancements */
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .storage-progress {
                    border-radius: 10px;
                    background: #f1f3f4;
                }

                .storage-progress .progress-bar {
                    border-radius: 10px;
                    transition: width 0.6s ease;
                }

                .storage-metric {
                    padding: 0.5rem;
                }

                .metric-value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .metric-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* File Grid Improvements */
                .files-container-wrapper {
                    overflow: visible !important;
                }

                .files-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    overflow: visible;
                }

                .file-card {
                    transition: all 0.3s ease;
                    border: 1px solid #e9ecef;
                    border-radius: 16px;
                    overflow: visible;
                    position: relative;
                    z-index: 1;
                    background: white;
                }

                .file-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
                    border-color: #667eea;
                    z-index: 10;
                }

                .file-card .dropdown {
                    position: static;
                }

                .file-card .dropdown-menu {
                    position: absolute;
                    z-index: 1050;
                    min-width: 160px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    padding: 0.5rem 0;
                }

                .file-card .dropdown-item {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .file-card .dropdown-item:hover {
                    background: #f8f9fa;
                    color: #667eea;
                }

                .file-card .dropdown-toggle {
                    border: 1px solid #e9ecef;
                    background: white;
                    transition: all 0.2s ease;
                    border-radius: 8px;
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .file-card .dropdown-toggle:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                    color: #667eea;
                }

                .file-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                    transition: all 0.3s ease;
                }

                .file-card:hover .file-icon {
                    transform: scale(1.1);
                }

                .file-name {
                    font-weight: 600;
                    color: #2d3748;
                    font-size: 1rem;
                }

                /* Tab Enhancements */
                .nav-pills .nav-link {
                    border-radius: 12px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    padding: 0.75rem 1.5rem;
                }

                .nav-pills .nav-link.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .view-toggle.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-color: transparent;
                }

                /* Processing Animation */
                .processing-indicator {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                /* Chat Interface */
                .chat-container {
                    height: 70vh;
                    display: flex;
                    flex-direction: column;
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    background: #f8f9fa;
                    border-radius: 16px;
                }

                .chat-message {
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .chat-message.user {
                    flex-direction: row-reverse;
                }

                .chat-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                    font-weight: 600;
                    flex-shrink: 0;
                }

                .chat-bubble {
                    max-width: 70%;
                    padding: 1rem 1.25rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .chat-message.user .chat-bubble {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .chat-message.ai .chat-bubble {
                    background: white;
                    border: 1px solid #e9ecef;
                    color: #374151;
                }

                .chat-input-container {
                    margin-top: 1.5rem;
                    position: relative;
                }

                .chat-input {
                    border-radius: 25px;
                    padding: 1rem 4rem 1rem 1.5rem;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }

                .chat-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .chat-send-btn {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                }

                .chat-send-btn:hover {
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .files-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .chat-bubble {
                        max-width: 85%;
                    }

                    .upload-card .card-body {
                        padding: 2rem 1.5rem;
                    }

                    .upload-icon-bg {
                        width: 60px;
                        height: 60px;
                    }

                    .upload-icon {
                        font-size: 2rem;
                    }
                }

                /* Alert Enhancements */
                .alert-sm {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    border-radius: 8px;
                }

                /* Additional Utilities */
                .tab-content {
                    position: relative;
                    z-index: 1;
                }

                .container-fluid {
                    position: relative;
                    z-index: 1;
                }
            </style>
        `;

        this.setupFilesEventListeners();
    }

    renderFilesGrid(files) {
        if (files.length === 0) {
            return `
                <div class="col-12 text-center py-5">
                    <div class="empty-state">
                        <i class="ti ti-folder-open text-muted mb-3" style="font-size: 4rem;"></i>
                        <h5 class="text-muted">No files uploaded yet</h5>
                        <p class="text-muted">Upload your first document to get started with your knowledge base</p>
                    </div>
                </div>
            `;
        }

        return files.map(file => `
            <div class="file-card" data-file-id="${file.id}">
                <div class="card-body p-4">
                    <div class="d-flex align-items-start mb-3">
                        <div class="file-icon bg-${file.color} bg-opacity-10 me-3">
                            <i class="${file.icon} text-${file.color}"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h6 class="file-name mb-2 text-truncate">${file.name}</h6>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="badge bg-${file.status === 'processed' ? 'success' : 'warning'} bg-opacity-10 text-${file.status === 'processed' ? 'success' : 'warning'}">
                                    ${file.status === 'processed' ? 'Processed' : 'Processing'}
                                    ${file.status === 'processing' ? '<span class="processing-indicator">...</span>' : ''}
                                </span>
                            </div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ti ti-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#"><i class="ti ti-download me-2"></i>Download</a></li>
                                <li><a class="dropdown-item" href="#"><i class="ti ti-share me-2"></i>Share</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#"><i class="ti ti-trash me-2"></i>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="file-meta">
                        <div class="d-flex justify-content-between align-items-center text-muted small mb-2">
                            <span class="fw-medium">${file.size}</span>
                            <span>${new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                        ${file.uploadedBy ? `<div class="mt-1"><small class="text-muted">Uploaded by <span class="fw-medium">${file.uploadedBy}</span></small></div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderChatInterface(type) {
        const isPersonal = type === 'personal';
        
        return `
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 p-4">
                            <div class="d-flex align-items-center">
                                <div class="chat-avatar bg-primary text-white me-3">
                                    <i class="ti ti-robot"></i>
                                </div>
                                <div>
                                    <h6 class="mb-0">AI Assistant</h6>
                                    <small class="text-muted">Chat with your ${isPersonal ? 'personal' : 'organization'} knowledge base</small>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="chat-container">
                                <div class="chat-messages" id="chat-messages">
                                    <div class="chat-message ai">
                                        <div class="chat-avatar bg-primary text-white">
                                            <i class="ti ti-robot"></i>
                                        </div>
                                        <div class="chat-bubble">
                                            Hello! I'm your AI assistant. I can help you find information from your ${isPersonal ? 'personal' : 'organization'} documents. What would you like to know?
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="chat-input-container px-4 pb-4">
                                    <div class="position-relative">
                                        <input type="text" class="form-control chat-input" placeholder="Ask me anything about your documents..." id="chat-input">
                                        <button class="chat-send-btn" id="chat-send">
                                            <i class="ti ti-send" style="font-size: 1rem;"></i>
                                        </button>
                                    </div>
                                    <div class="mt-3">
                                        <small class="text-muted">
                                            <i class="ti ti-info-circle me-1"></i>
                                            Try asking: "What's in my project proposal?" or "Summarize the meeting notes"
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupFilesEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // File upload
        const uploadBtn = document.querySelector('.upload-btn');
        const fileInput = document.getElementById('file-upload');
        const uploadArea = document.getElementById('upload-area');
        const dragOverlay = document.getElementById('drag-overlay');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        // Drag and drop functionality
        if (uploadArea && dragOverlay) {
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, this.preventDefaults, false);
                document.body.addEventListener(eventName, this.preventDefaults, false);
            });

            // Highlight drop area when item is dragged over it
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.add('drag-over');
                    dragOverlay.classList.add('show');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.remove('drag-over');
                    dragOverlay.classList.remove('show');
                }, false);
            });

            // Handle dropped files
            uploadArea.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                this.handleFileUpload(files);
            }, false);

            // Browse text click
            const browseText = document.querySelector('.upload-browse-text');
            if (browseText) {
                browseText.addEventListener('click', () => {
                    fileInput.click();
                });
            }
        }

        // Chat functionality
        this.setupChatEventListeners();

        // View toggle
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-toggle').classList.add('active');
                
                const view = e.target.closest('.view-toggle').getAttribute('data-view');
                this.toggleView(view);
            });
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setupChatEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        
        if (chatInput && chatSend) {
            const sendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage('user', message);
                    chatInput.value = '';
                    
                    // Simulate AI response
                    setTimeout(() => {
                        this.addChatMessage('ai', this.generateAIResponse(message));
                    }, 1000);
                }
            };

            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('show', 'active');
        });
        document.getElementById(`${tab}-tab`).classList.add('show', 'active');
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Add file to the list
            const newFile = {
                id: fileId,
                name: file.name,
                type: file.name.split('.').pop().toLowerCase(),
                size: this.formatFileSize(file.size),
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'processing',
                icon: this.getFileIcon(file.name),
                color: this.getFileColor(file.name)
            };
            
            this.files[this.currentType].unshift(newFile);
            
            // Simulate upload progress
            this.simulateUpload(fileId);
            
            // Re-render files grid
            const filesContainer = document.getElementById('files-container');
            if (filesContainer) {
                filesContainer.innerHTML = this.renderFilesGrid(this.files[this.currentType]);
            }
        });
    }

    simulateUpload(fileId) {
        // Simulate processing time
        setTimeout(() => {
            const file = this.files[this.currentType].find(f => f.id === fileId);
            if (file) {
                file.status = 'processed';
                
                // Re-render files grid
                const filesContainer = document.getElementById('files-container');
                if (filesContainer) {
                    filesContainer.innerHTML = this.renderFilesGrid(this.files[this.currentType]);
                }
                
                // Show notification
                if (window.NotificationUtils) {
                    const currentUser = window.auth?.getUser();
                    if (currentUser) {
                        window.NotificationUtils.notifySystem(
                            currentUser.id,
                            'File Processed',
                            `"${file.name}" has been processed and added to your knowledge base`,
                            `/my-files-${this.currentType}`,
                            'View Files'
                        );
                    }
                }
            }
        }, 3000 + Math.random() * 2000); // 3-5 seconds
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? 
            '<div class="chat-avatar bg-secondary text-white">U</div>' :
            '<div class="chat-avatar bg-primary text-white"><i class="ti ti-robot"></i></div>';
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="chat-bubble">${message}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const responses = [
            "I found some relevant information in your documents. Let me analyze that for you...",
            "Based on your uploaded files, here's what I can tell you...",
            "I've searched through your knowledge base and found several relevant documents...",
            "That's an interesting question! Let me check your documents for related information...",
            "I can help you with that. I've found some relevant content in your files..."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'ti-file-text',
            'doc': 'ti-file-text',
            'docx': 'ti-file-text',
            'txt': 'ti-file-text',
            'xls': 'ti-file-spreadsheet',
            'xlsx': 'ti-file-spreadsheet',
            'ppt': 'ti-presentation',
            'pptx': 'ti-presentation'
        };
        return iconMap[ext] || 'ti-file';
    }

    getFileColor(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const colorMap = {
            'pdf': 'danger',
            'doc': 'primary',
            'docx': 'primary',
            'txt': 'secondary',
            'xls': 'success',
            'xlsx': 'success',
            'ppt': 'warning',
            'pptx': 'warning'
        };
        return colorMap[ext] || 'secondary';
    }

    toggleView(view) {
        const filesContainer = document.getElementById('files-container');
        if (!filesContainer) return;
        
        if (view === 'list') {
            filesContainer.className = 'files-list';
            // Implement list view rendering
        } else {
            filesContainer.className = 'files-grid';
        }
    }
}

// Create global instance
window.fileManager = new FileManager();

// Export functions for router
window.loadPersonalFiles = function() {
    window.fileManager.renderFilesPage('personal');
};

window.loadOrganizationFiles = function() {
    window.fileManager.renderFilesPage('organization');
};