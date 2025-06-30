/**
 * AgendaFlow - A simple agenda management system
 * Handles creation, management, and display of agenda items
 */

class AgendaFlow {
  constructor() {
    // State management
    this.state = {
      agendaItems: new Map(), // Maps agendaId to agenda item data
      currentAgendaId: null, // Currently selected agenda item ID
      lastAgendaId: 0, // Counter for generating unique IDs
      quillInstances: new Map(), // Maps thread ID to Quill instance

      // Audio recording state
      audioRecorder: null,
      audioStream: null,
      audioChunks: [],
      isRecording: false,

      // Initialization state
      isInitialized: false,
      eventDelegationSetup: false,
      mutationObserver: null,

      quillOptions: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{
              'list': 'ordered'
            }],
            [{
              'color': []
            }, {
              'background': []
            }],
            [{
              'header': [1, 2, 3, 4, 5, 6, false]
            }],
            ['code-block'],
            ['link', 'image', 'video', ],
          ],
          keyboard: {
            bindings: {
              slash: {
                key: '/',
                handler: function(range, context) {

                  // In Quill keyboard bindings, 'this' refers to the Quill instance
                  const quill = this;

                  // Get the AgendaFlow instance (we need to find a way to access it)
                  const agendaFlow = window.agendaFlow;
                  if (!agendaFlow) return true;

                  // Get current agenda item
                  const agendaId = agendaFlow.state.currentAgendaId;
                  const agendaItem = agendaFlow.state.agendaItems.get(agendaId);

                  // Create and show file dropdown if files exist
                  if (agendaItem?.files?.length) {
                    agendaFlow.showFileDropdown(quill, range, agendaItem.files);
                  }

                  return false;
                }
              }
            }
          }
        },
        placeholder: 'Type your message here...',
        bounds: document.body
      },

      // Define urgency levels and their corresponding classes
      urgencyLevels: [{
          id: 'normal',
          label: 'Normal',
          class: 'text-muted',
          bgClass: 'bg-dark-super-subtle',
          borderClass: 'border-dark'
        },
        {
          id: 'moderate',
          label: 'Moderate',
          class: 'text-secondary',
          bgClass: 'bg-secondary-super-subtle',
          borderClass: 'border-secondary'
        },
        {
          id: 'important',
          label: 'Important',
          class: 'text-primary',
          bgClass: 'bg-primary-super-subtle',
          borderClass: 'border-primary'
        },
        {
          id: 'critical',
          label: 'Critical',
          class: 'text-warning',
          bgClass: 'bg-warning-super-subtle',
          borderClass: 'border-warning'
        },
        {
          id: 'mandatory',
          label: 'Mandatory',
          class: 'text-danger',
          bgClass: 'bg-danger-super-subtle',
          borderClass: 'border-danger'
        }
      ],

      // Default urgency
      defaultUrgency: 'important',

      // UI references
      elements: {
        allAgendaPoints: null,
        detailsUrgencyPill: null,
        detailsPanel: null
      }
    };

    // Initialize immediately with event delegation and mutation observer
    this.initializeWithDynamicContent();
  }

  /**
   * Initialize with dynamic content support using event delegation and mutation observer
   */
  initializeWithDynamicContent() {
    // Set up event delegation immediately
    this.setupEventDelegation();

    // Set up mutation observer to detect when agenda elements are added to DOM
    this.setupMutationObserver();

    // Try to initialize elements if they already exist
    this.tryInitializeElements();
  }

  /**
   * Set up mutation observer to watch for dynamically added content
   */
  setupMutationObserver() {
    this.state.mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any agenda-related elements were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.id === 'all-agenda-points' ||
                element.id === 'agenda-point-details' ||
                element.id === 'search-agenda-point' ||
                element.id === 'add-agenda-point' ||
                element.querySelector && (
                  element.querySelector('#all-agenda-points') ||
                  element.querySelector('#agenda-point-details') ||
                  element.querySelector('#search-agenda-point') ||
                  element.querySelector('#add-agenda-point')
                )) {
                shouldReinitialize = true;
              }
            }
          });
        }
      });

      if (shouldReinitialize) {
        this.tryInitializeElements();
      }
    });

    // Start observing
    this.state.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Try to initialize DOM element references (safe for dynamic content)
   */
  tryInitializeElements() {
    const allAgendaPoints = document.getElementById('all-agenda-points');
    const detailsUrgencyPill = document.getElementById('details-urgency-pill');
    const detailsPanel = document.getElementById('agenda-point-details');
    if (allAgendaPoints || detailsUrgencyPill || detailsPanel) {
      this.state.elements.allAgendaPoints = allAgendaPoints;
      this.state.elements.detailsUrgencyPill = detailsUrgencyPill;
      this.state.elements.detailsPanel = detailsPanel;

      if (!this.state.isInitialized) {
        this.state.isInitialized = true;

        // Initialize sortable if agenda points container exists
        if (allAgendaPoints) {
          this.initializeSortable();
        }

        // Add first agenda point if none exists and container is empty, but only ONCE per session
        if (
          allAgendaPoints &&
          allAgendaPoints.children.length === 0 &&
          this.state.agendaItems.size === 0 &&
          !this.state.defaultAgendaCreated
        ) {
          this.state.defaultAgendaCreated = true;
          setTimeout(() => {
            this.addNewAgendaPoint(
              'Your first agenda point',
              "This is your first agenda point. Let's create something awesome!"
            );
          }, 100);
        } else if (allAgendaPoints) {}
      } else {}
    } else {}
  }

  /**
   * Set up event delegation for all agenda interactions
   */
  setupEventDelegation() {
    // Prevent duplicate event listeners by checking if already set up
    if (this.state.eventDelegationSetup) {
      return;
    }

    // Search functionality for agenda points (event delegation)
    this._inputHandler = (e) => {
      if (e.target.id === 'search-agenda-point') {
        this.filterAgendaPoints(e.target.value);
      }
    };
    document.addEventListener('input', this._inputHandler);

    // Add agenda point button (event delegation)
    this._clickHandler = (e) => {

      // Handle file upload button using event delegation (moved to top)
      const isFileUpload = e.target.id === 'agenda-file-upload' || e.target.closest('#agenda-file-upload');
      if (isFileUpload) {
        if (!this.state.currentAgendaId) {
          return;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip,.svg,.txt';

        fileInput.addEventListener('change', (event) => {
          const files = event.target.files;
          if (files.length > 0) {
            this.handleFileUpload(files);
          }
        });

        fileInput.click();
        return;
      }

      if (e.target.id === 'add-agenda-point' || e.target.closest('#add-agenda-point')) {
        e.preventDefault();
        this.addNewAgendaPoint('', '');
        return;
      }

      // Handle add thread button
      const addThreadBtn = e.target.closest('#agenda-add-thread');
      if (addThreadBtn) {
        const agendaId = this.state.currentAgendaId;
        if (agendaId) {
          this.addNewThread(agendaId);
        }
        return;
      }

      // Handle post thread button
      const postThreadBtn = e.target.closest('.post-thread');
      if (postThreadBtn) {
        const threadElement = postThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.saveThread(threadElement);
        }
        return;
      }

      // Handle save thread button
      const saveThreadBtn = e.target.closest('.save-thread');
      if (saveThreadBtn) {
        const threadElement = saveThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.saveThread(threadElement);
        }
        return;
      }

      // Handle cancel thread button
      const cancelThreadBtn = e.target.closest('.cancel-thread');
      if (cancelThreadBtn) {
        const threadElement = cancelThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.cancelEditThread(threadElement);
        }
        return;
      }

      // Handle edit thread button
      const editThreadBtn = e.target.closest('.edit-thread');
      if (editThreadBtn) {
        const threadElement = editThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.enableThreadEditing(threadElement);
        }
        return;
      }

      // Handle delete thread button
      const deleteThreadBtn = e.target.closest('.delete-thread');
      if (deleteThreadBtn) {
        const threadElement = deleteThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.removeThread(threadElement);
        }
        return;
      }

      // Handle approve thread button
      const approveThreadBtn = e.target.closest('.approve-thread');
      if (approveThreadBtn) {
        const threadElement = approveThreadBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.toggleThreadApproval(threadElement);
        }
        return;
      }

      // Handle connect action button
      const connectActionBtn = e.target.closest('.connect-action');
      if (connectActionBtn) {
        const threadElement = connectActionBtn.closest('.agenda-thread-post');
        if (threadElement) {
          this.connectActionToThread(threadElement);
        }
        return;
      }

      // Handle audio clip actions
      const approveAudioBtn = e.target.closest('.approve-audio');
      if (approveAudioBtn) {
        const audioElement = approveAudioBtn.closest('.agenda-audio-clip');
        if (audioElement) {
          this.toggleAudioApproval(audioElement);
        }
        return;
      }

      const deleteAudioBtn = e.target.closest('.delete-audio');
      if (deleteAudioBtn) {
        const audioElement = deleteAudioBtn.closest('.agenda-audio-clip');
        if (audioElement) {
          this.removeAudioClip(audioElement);
        }
        return;
      }

      const connectAudioActionBtn = e.target.closest('.connect-audio-action');
      if (connectAudioActionBtn) {
        const audioElement = connectAudioActionBtn.closest('.agenda-audio-clip');
        if (audioElement) {
          this.connectActionToAudio(audioElement);
        }
        return;
      }

      // Handle agenda item clicks and actions using event delegation
      const agendaContainer = e.target.closest('#all-agenda-points');
      if (agendaContainer) {
        // Handle delete button clicks
        const deleteBtn = e.target.closest('.dropdown-item');
        if (deleteBtn && (deleteBtn.textContent.includes('Delete Point') || deleteBtn.textContent.includes('Delete Agenda'))) {
          const agendaItem = deleteBtn.closest('.p-4.rounded-4');
          if (agendaItem) {
            const agendaId = agendaItem.dataset.agendaId;
            this.state.agendaItems.delete(agendaId);
            agendaItem.remove();
            this.renumberAgendaPoints();
            this.syncAgendaItemsOrder();

            // Validate and update linked agendas in actions
            if (typeof validateLinkedAgendas === 'function') {
              validateLinkedAgendas();
            }
          }
          return;
        }

        // Handle move up/down actions
        const moveUpBtn = e.target.closest('.move-up-action');
        if (moveUpBtn) {
          e.preventDefault();
          const agendaItem = moveUpBtn.closest('.p-4.rounded-4');
          if (agendaItem) {
            this.moveAgendaItem(agendaItem, 'up');
          }
          return;
        }

        const moveDownBtn = e.target.closest('.move-down-action');
        if (moveDownBtn) {
          e.preventDefault();
          const agendaItem = moveDownBtn.closest('.p-4.rounded-4');
          if (agendaItem) {
            this.moveAgendaItem(agendaItem, 'down');
          }
          return;
        }

        // Handle minimize/maximize toggle
        const toggleMinimizeBtn = e.target.closest('.toggle-minimize');
        if (toggleMinimizeBtn) {
          e.preventDefault();
          const agendaItem = toggleMinimizeBtn.closest('.p-4.rounded-4');
          if (agendaItem) {
            this.toggleAgendaItemMinimize(agendaItem);
          }
          return;
        }

        // Handle urgency dropdown clicks
        const urgencyOption = e.target.closest('.dropdown-item');
        if (urgencyOption && urgencyOption.classList.contains('urgency-option')) {
          e.preventDefault();
          const urgencyLevel = urgencyOption.dataset.urgency;
          this.updateAgendaPointUrgency(urgencyLevel);
          return;
        }

        // Handle agenda item selection
        const agendaItem = e.target.closest('.p-4.rounded-4');
        if (agendaItem) {
          this.selectAgendaItem(agendaItem);
        }
        return;
      }

      // Handle audio clip button using event delegation
      if (e.target.id === 'agenda-audio-clip' || e.target.closest('#agenda-audio-clip')) {
        if (!this.state.currentAgendaId) {
          console.warn('No agenda point selected for audio recording.');
          return;
        }
        this.showAudioRecordingModal();
        return;
      }

      // Handle view files button using event delegation
      if (e.target.id === 'agenda-view-files' || e.target.closest('#agenda-view-files')) {
        if (!this.state.currentAgendaId) {
          console.warn('No agenda point selected for viewing files.');
          return;
        }
        this.populateFilesOffcanvas();
        return;
      }

      // Handle urgency dropdown in the details panel using event delegation
      const detailsPanel = e.target.closest('#agenda-point-details');
      if (detailsPanel) {
        const urgencyOption = e.target.closest('.dropdown-item');
        if (urgencyOption && urgencyOption.classList.contains('urgency-option')) {
          e.preventDefault();
          const urgencyLevel = urgencyOption.dataset.urgency;
          this.updateAgendaPointUrgency(urgencyLevel);
        }
        return;
      }
    };
    document.addEventListener('click', this._clickHandler);

    // Handle Enter/Escape keys in thread text using event delegation
    document.addEventListener('keydown', (e) => {
      const threadText = e.target.closest('.thread-text[contenteditable="true"]');
      if (threadText) {
        const threadElement = threadText.closest('.agenda-thread-post');
        if (threadElement) {
          // Save on Enter
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.saveThread(threadElement);
          }

          // Cancel on Escape
          if (e.key === 'Escape') {
            this.cancelEditThread(threadElement);
          }
        }
        return;
      }
    });

    // Handle Bootstrap off-canvas show event using event delegation
    document.addEventListener('show.bs.offcanvas', (e) => {
      if (e.target.id === 'filesOffcanvas' && this.state.currentAgendaId) {
        this.populateFilesOffcanvas();
      }
    });

    // Set up title and description editing with event delegation
    this.setupTitleEditing();
    this.setupDescriptionEditing();

    // Mark event delegation as set up
    this.state.eventDelegationSetup = true;
  }

  /**
   * Reinitialize AgendaFlow for dynamically loaded content
   * Call this method when the create-new page is loaded
   */
  reinitializeForDynamicContent() {

    // Reset initialization state
    this.state.isInitialized = false;

    // Try to initialize elements immediately
    this.tryInitializeElements();
  }

  /**
   * Destroy the current instance and clean up resources
   */
  destroy() {
    if (this.state.mutationObserver) {
      this.state.mutationObserver.disconnect();
      this.state.mutationObserver = null;
    }

    if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = null;
    }

    // Clean up event listeners
    if (this.state.eventDelegationSetup) {
      if (this._inputHandler) {
        document.removeEventListener('input', this._inputHandler);
      }
      if (this._clickHandler) {
        document.removeEventListener('click', this._clickHandler);
      }
      this.state.eventDelegationSetup = false;
    }

    // Clear state
    this.state.agendaItems.clear();
    this.state.quillInstances.clear();
    this.state.currentAgendaId = null;
    this.state.isInitialized = false;
  }

  /**
   * Populate the files off-canvas with uploaded files (for Bootstrap integration)
   */
  populateFilesOffcanvas() {
    const agendaId = this.state.currentAgendaId;
    if (!agendaId) return;

    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    // Get the off-canvas elements
    const filesContainer = document.getElementById('files-chat-container');
    const noFilesMessage = document.getElementById('no-files-message');
    const offcanvasTitle = document.getElementById('filesOffcanvasLabel');

    if (!filesContainer) return;

    // Update the title with file count
    const fileCount = agendaItem.files ? agendaItem.files.length : 0;
    offcanvasTitle.innerHTML = `<i class="ti ti-paperclip me-2"></i>Files <span class="text-muted">(${fileCount})</span>`;

    // Clear existing content
    filesContainer.innerHTML = '';

    if (!agendaItem.files || agendaItem.files.length === 0) {
      // Show no files message
      const noFilesDiv = document.createElement('div');
      noFilesDiv.className = 'text-center py-5';
      noFilesDiv.innerHTML = `
                <i class="ti ti-file-off fs-1 text-muted"></i>
                <p class="mt-2 text-muted">No files uploaded yet.</p>
            `;
      filesContainer.appendChild(noFilesDiv);
    } else {
      // Create the files chat structure
      const filesChatDiv = document.createElement('div');
      filesChatDiv.className = 'files-chat';

      // Add header with count
      const headerDiv = document.createElement('div');
      headerDiv.innerHTML = `
                <h6 class="fw-semibold mb-3 text-nowrap">
                    Files <span class="text-muted">(${fileCount})</span>
                </h6>
            `;
      filesChatDiv.appendChild(headerDiv);

      // Add files following the provided pattern
      agendaItem.files.forEach(file => {
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
        const fileDate = new Date(file.lastModified).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const iconClass = this.getFileTypeIcon(file.name);

        const fileItem = document.createElement('a');
        fileItem.href = 'javascript:void(0)';
        fileItem.className = 'hstack gap-3 file-chat-hover justify-content-between text-nowrap mb-9';
        fileItem.setAttribute('data-file-name', file.name);

        fileItem.innerHTML = `
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-1 text-bg-light p-6">
                            <i class="${iconClass} fs-4"></i>
                        </div>
                        <div>
                            <h6 class="fw-semibold">
                                ${file.name}
                            </h6>
                            <div class="d-flex align-items-center gap-3 fs-2 text-muted">
                                <span>${fileSize} MB</span>
                                <span>${fileDate}</span>
                            </div>
                        </div>
                    </div>
                    <span class="position-relative nav-icon-hover download-file">
                        <i class="ti ti-download text-dark fs-6 bg-hover-primary"></i>
                    </span>
                `;

        // Add click handler for download
        fileItem.addEventListener('click', (e) => {
          e.preventDefault();
          this.downloadFile(file.name, file);
        });

        filesChatDiv.appendChild(fileItem);
      });

      filesContainer.appendChild(filesChatDiv);
    }
  }

  /**
   * Show the files off-canvas with uploaded files
   */
  showFilesOffcanvas() {
    const agendaId = this.state.currentAgendaId;
    if (!agendaId) return;

    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    // Get the off-canvas elements
    const offcanvas = document.getElementById('filesOffcanvas');
    const filesContainer = document.getElementById('files-chat-container');
    const noFilesMessage = document.getElementById('no-files-message');
    const offcanvasTitle = document.getElementById('filesOffcanvasLabel');

    if (!offcanvas || !filesContainer) return;

    // Update the title with file count
    const fileCount = agendaItem.files ? agendaItem.files.length : 0;
    offcanvasTitle.innerHTML = `<i class="ti ti-paperclip me-2"></i>Files <span class="text-muted">(${fileCount})</span>`;

    // Clear existing content
    filesContainer.innerHTML = '';

    if (!agendaItem.files || agendaItem.files.length === 0) {
      // Show no files message
      noFilesMessage.style.display = 'block';
      filesContainer.appendChild(noFilesMessage);
    } else {
      // Hide no files message
      noFilesMessage.style.display = 'none';

      // Create the files chat structure
      const filesChatDiv = document.createElement('div');
      filesChatDiv.className = 'files-chat';

      // Add header with count
      const headerDiv = document.createElement('div');
      headerDiv.innerHTML = `
                <h6 class="fw-semibold mb-3 text-nowrap">
                    Files <span class="text-muted">(${fileCount})</span>
                </h6>
            `;
      filesChatDiv.appendChild(headerDiv);

      // Add files following the provided pattern
      agendaItem.files.forEach(file => {
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
        const fileDate = new Date(file.lastModified).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const iconClass = this.getFileTypeIcon(file.name);

        // Fix: The getFileTypeIcon method returns the full class string, use it directly
        const fileItem = document.createElement('a');
        fileItem.href = 'javascript:void(0)';
        fileItem.className = 'hstack gap-3 file-chat-hover justify-content-between text-nowrap mb-9';
        fileItem.setAttribute('data-file-name', file.name);

        fileItem.innerHTML = `
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-1 text-bg-light p-6">
                            <i class="${iconClass} fs-4"></i>
                        </div>
                        <div>
                            <h6 class="fw-semibold">
                                ${file.name}
                            </h6>
                            <div class="d-flex align-items-center gap-3 fs-2 text-muted">
                                <span>${fileSize} MB</span>
                                <span>${fileDate}</span>
                            </div>
                        </div>
                    </div>
                    <span class="position-relative nav-icon-hover download-file">
                        <i class="ti ti-download text-dark fs-6 bg-hover-primary"></i>
                    </span>
                `;

        // Add click handler for download
        fileItem.addEventListener('click', (e) => {
          e.preventDefault();
          this.downloadFile(file.name, file);
        });

        filesChatDiv.appendChild(fileItem);
      });

      filesContainer.appendChild(filesChatDiv);
    }

    // Fix: Properly manage Bootstrap Offcanvas instance lifecycle
    // Dispose any existing instance first to ensure clean state
    let bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.dispose();
    }

    // Create a new instance and show it
    bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  }

  /**
   * Handle the selected files
   * @param {FileList} files - The files selected by the user
   */
  handleFileUpload(files) {
    const agendaId = this.state.currentAgendaId;
    if (!agendaId) return;

    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    if (!agendaItem.files) {
      agendaItem.files = [];
    }

    for (const file of files) {
      // Store the actual File object for later download
      const newFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        fileObject: file // Store the File object itself
      };
      agendaItem.files.push(newFile);
    }

    this.state.agendaItems.set(agendaId, agendaItem);
    this.renderFiles(agendaItem);
  }

  /**
   * Update the file count in the UI for an agenda item
   * @param {object} agendaItem - The agenda item to update
   */
  /**
   * Remove a file from an agenda item
   * @param {string} agendaId - The ID of the agenda item
   * @param {string} fileName - The name of the file to remove
   */
  removeFile(agendaId, fileName) {
    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem || !agendaItem.files) return;

    // Find and remove the file
    const fileIndex = agendaItem.files.findIndex(file => file.name === fileName);
    if (fileIndex !== -1) {
      agendaItem.files.splice(fileIndex, 1);
      this.state.agendaItems.set(agendaId, agendaItem);
      this.renderFiles(agendaItem);
      this.showToast('File removed successfully', 'success');
    }
  }

  updateFileCount(agendaItem) {
    const fileCount = agendaItem.files ? agendaItem.files.length : 0;

    // Update file count in the agenda item footer
    const agendaItemElement = document.querySelector(`[data-agenda-id="${agendaItem.id}"]`);
    if (agendaItemElement) {
      const fileCountElement = agendaItemElement.querySelector('.agenda-footer .d-flex.align-items-center.gap-2:not(.ms-4) .fw-semibold');
      if (fileCountElement) {
        fileCountElement.textContent = `${fileCount} file${fileCount !== 1 ? 's' : ''}`;
      }
    }
  }

  /**
   * Render the files for the current agenda item
   * @param {object} agendaItem - The agenda item whose files to render
   */
  renderFiles(agendaItem) {
    const filesListContainer = document.getElementById('agenda-files-list');
    if (!filesListContainer) return;

    filesListContainer.innerHTML = '';

    if (!agendaItem) return;

    // Update file count in the UI
    this.updateFileCount(agendaItem);

    if (!agendaItem.files || agendaItem.files.length === 0) {
      return;
    }

    // Add click handler for delete buttons and file links
    filesListContainer.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('button[data-file-name]');
      const fileLink = e.target.closest('a[data-file-name]');

      if (deleteBtn) {
        e.preventDefault();
        const fileName = deleteBtn.getAttribute('data-file-name');
        this.removeFile(agendaItem.id, fileName);
      } else if (fileLink) {
        e.preventDefault();
        const fileName = fileLink.getAttribute('data-file-name');
        // Find the file and trigger download
        const file = agendaItem.files.find(f => f.name === fileName);
        if (file) {
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    });

    agendaItem.files.forEach(file => {
      const fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
      const fileDate = new Date(file.lastModified).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const iconClass = this.getFileTypeIcon(file.name);

      // Truncate filename if longer than 100 characters
      const displayName = file.name.length > 100 ?
        `${file.name.substring(0, 97)}...` :
        file.name;

      const fileHtml = `
                <div class="d-flex align-items-center gap-3 p-2 border rounded-2 mb-2" style="min-width: 300px;">
                  <div class="d-flex align-items-center gap-3 flex-grow-1" style="min-width: 0;">
                    <div class="rounded-1 text-bg-light p-6 flex-shrink-0">
                      <i class="ti ${iconClass} fs-4"></i>
                    </div>
                    <div class="d-flex flex-column" style="min-width: 0; flex: 1;">
                      <h6 class="fw-semibold mb-0 text-truncate" title="${file.name}">
                        <a href="#" class="text-decoration-none text-body" data-file-name="${file.name}">
                          ${displayName}
                        </a>
                      </h6>
                      <div class="d-flex align-items-center gap-3 fs-2 text-muted">
                        <span>${fileSize} MB</span>
                        <span>${fileDate}</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-icon btn-light flex-shrink-0" data-file-name="${file.name}" title="Remove file">
                    <i class="ti ti-x text-danger"></i>
                  </button>
                </a>`;
      filesListContainer.insertAdjacentHTML('beforeend', fileHtml);
    });
  }

  /**
   * Get the appropriate icon class for a file type
   * @param {string} fileName - The name of the file
   * @returns {string} The icon class string with color
   */
  getFileTypeIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      // Documents - using Tabler icons that actually exist
      'pdf': {
        icon: 'file-text',
        color: 'text-danger'
      },
      'doc': {
        icon: 'file-word',
        color: 'text-primary'
      },
      'docx': {
        icon: 'file-word',
        color: 'text-primary'
      },
      'txt': {
        icon: 'file-text',
        color: 'text-muted'
      },
      'rtf': {
        icon: 'file-text',
        color: 'text-primary'
      },
      'odt': {
        icon: 'file-text',
        color: 'text-primary'
      },

      // Spreadsheets
      'xls': {
        icon: 'file-spreadsheet',
        color: 'text-success'
      },
      'xlsx': {
        icon: 'file-spreadsheet',
        color: 'text-success'
      },
      'csv': {
        icon: 'file-spreadsheet',
        color: 'text-success'
      },
      'ods': {
        icon: 'file-spreadsheet',
        color: 'text-success'
      },

      // Presentations
      'ppt': {
        icon: 'presentation',
        color: 'text-warning'
      },
      'pptx': {
        icon: 'presentation',
        color: 'text-warning'
      },
      'odp': {
        icon: 'presentation',
        color: 'text-warning'
      },

      // Archives
      'zip': {
        icon: 'file-zip',
        color: 'text-primary'
      },
      'rar': {
        icon: 'file-zip',
        color: 'text-primary'
      },
      '7z': {
        icon: 'file-zip',
        color: 'text-primary'
      },
      'tar': {
        icon: 'file-zip',
        color: 'text-primary'
      },
      'gz': {
        icon: 'file-zip',
        color: 'text-primary'
      },

      // Code
      'js': {
        icon: 'brand-javascript',
        color: 'text-warning'
      },
      'jsx': {
        icon: 'brand-react',
        color: 'text-info'
      },
      'ts': {
        icon: 'brand-typescript',
        color: 'text-primary'
      },
      'tsx': {
        icon: 'brand-typescript',
        color: 'text-primary'
      },
      'html': {
        icon: 'brand-html5',
        color: 'text-danger'
      },
      'css': {
        icon: 'brand-css3',
        color: 'text-info'
      },
      'scss': {
        icon: 'brand-sass',
        color: 'text-pink'
      },
      'json': {
        icon: 'file-code',
        color: 'text-muted'
      },
      'xml': {
        icon: 'file-code',
        color: 'text-orange'
      },
      'sql': {
        icon: 'database',
        color: 'text-primary'
      },
      'php': {
        icon: 'brand-php',
        color: 'text-indigo'
      },
      'py': {
        icon: 'brand-python',
        color: 'text-info'
      },
      'java': {
        icon: 'coffee',
        color: 'text-orange'
      },
      'cs': {
        icon: 'file-code',
        color: 'text-primary'
      },
      'cpp': {
        icon: 'file-code',
        color: 'text-primary'
      },
      'h': {
        icon: 'file-code',
        color: 'text-muted'
      },
      'swift': {
        icon: 'brand-swift',
        color: 'text-orange'
      },
      'kt': {
        icon: 'file-code',
        color: 'text-purple'
      },
      'go': {
        icon: 'brand-golang',
        color: 'text-cyan'
      },
      'rs': {
        icon: 'file-code',
        color: 'text-orange'
      },

      // Media
      'jpg': {
        icon: 'photo',
        color: 'text-info'
      },
      'jpeg': {
        icon: 'photo',
        color: 'text-info'
      },
      'png': {
        icon: 'photo',
        color: 'text-info'
      },
      'gif': {
        icon: 'gif',
        color: 'text-info'
      },
      'svg': {
        icon: 'vector',
        color: 'text-orange'
      },
      'webp': {
        icon: 'photo',
        color: 'text-info'
      },
      'bmp': {
        icon: 'photo',
        color: 'text-info'
      },
      'tiff': {
        icon: 'photo',
        color: 'text-info'
      },
      'mp4': {
        icon: 'video',
        color: 'text-danger'
      },
      'mov': {
        icon: 'video',
        color: 'text-danger'
      },
      'avi': {
        icon: 'video',
        color: 'text-danger'
      },
      'wmv': {
        icon: 'video',
        color: 'text-danger'
      },
      'mp3': {
        icon: 'music',
        color: 'text-purple'
      },
      'wav': {
        icon: 'music',
        color: 'text-purple'
      },
      'ogg': {
        icon: 'music',
        color: 'text-purple'
      },
      'flac': {
        icon: 'music',
        color: 'text-purple'
      },

      // Data
      'db': {
        icon: 'database',
        color: 'text-muted'
      },
      'sqlite': {
        icon: 'database',
        color: 'text-primary'
      },
      'mdb': {
        icon: 'database',
        color: 'text-primary'
      },

      // Config
      'env': {
        icon: 'settings',
        color: 'text-muted'
      },
      'gitignore': {
        icon: 'brand-git',
        color: 'text-danger'
      },
      'gitattributes': {
        icon: 'brand-git',
        color: 'text-danger'
      },
      'editorconfig': {
        icon: 'settings',
        color: 'text-muted'
      },
      'babelrc': {
        icon: 'settings',
        color: 'text-warning'
      },
      'eslintrc': {
        icon: 'settings',
        color: 'text-purple'
      },
      'prettierrc': {
        icon: 'settings',
        color: 'text-pink'
      }
    };

    const fileType = iconMap[extension] || {
      icon: 'file',
      color: 'text-muted'
    };
    return `ti ti-${fileType.icon} ${fileType.color}`;
  }

  /**
   * Add a new agenda item
   * @param {Object} item - The agenda item to add
   */
  addAgendaItem(item) {
    this.agendaItems.push(item);
    this.renderAgenda();
  }

  /**
   * Remove an agenda item by index
   * @param {number} index - Index of the item to remove
   */
  removeAgendaItem(index) {
    if (index >= 0 && index < this.agendaItems.length) {
      this.agendaItems.splice(index, 1);
      this.renderAgenda();
    }
  }

  /**
   * Update an existing agenda item
   * @param {number} index - Index of the item to update
   * @param {Object} updates - Object containing updated properties
   */
  updateAgendaItem(index, updates) {
    if (index >= 0 && index < this.agendaItems.length) {
      this.agendaItems[index] = {
        ...this.agendaItems[index],
        ...updates
      };
      this.renderAgenda();
    }
  }

  /**
   * Render the agenda in the UI
   */
  renderAgenda() {}

  /**
   * Add a new agenda point to the UI
   */
  /**
   * Select an agenda item and update the details panel
   * @param {HTMLElement} agendaItemElement - The clicked agenda item element
   */
  selectAgendaItem(agendaItemElement) {
    const agendaId = agendaItemElement.dataset.agendaId;
    if (!agendaId) return;

    // Update state
    this.state.currentAgendaId = agendaId;

    // Get the agenda item data
    const agendaItem = this.state.agendaItems.get(agendaId);

    // If no agenda item is found, clear the details panel and threads
    if (!agendaItem) {
      const detailsTitle = document.querySelector('#agenda-point-title');
      if (detailsTitle) detailsTitle.textContent = 'Select an Agenda Point';
      this.renderThreads(null); // Pass null to clear threads
      this.updateThreadCount({
        threads: []
      });
      return;
    }

    // Update the details panel title
    const detailsTitle = document.querySelector('#agenda-point-title');
    if (detailsTitle) {
      detailsTitle.textContent = agendaItem.title;
    }

    // Get the urgency level
    const urgency = this.state.urgencyLevels.find(level => level.id === agendaItem.urgency) ||
      this.state.urgencyLevels.find(level => level.id === this.state.defaultUrgency);

    // Remove selection styles from all other agenda items
    document.querySelectorAll('#all-agenda-points > .p-4.rounded-4').forEach(item => {
      item.classList.remove('border', 'border-dark', 'border-secondary', 'border-primary', 'border-warning', 'border-danger', 'selectedagendashadow');
    });

    // Add selection style to the clicked agenda item
    if (urgency) {
      agendaItemElement.classList.add('border', urgency.borderClass, 'selectedagendashadow');
    } else {
      agendaItemElement.classList.add('border', 'border-primary', 'selectedagendashadow');
    }

    // Update the entire details panel UI
    this.updateDetailsPanelUI(agendaItem);

    // Render the files for the selected agenda item
    this.renderFiles(agendaItem);

    // Render the threads for the selected agenda item
    this.renderThreads(agendaItem);

    // Update the thread count
    this.updateThreadCount(agendaItem);
  }

  /**
   * Update the details panel with the selected agenda item's data
   * @param {HTMLElement} agendaItemElement - The agenda item element
   */
  updateDetailsPanel(agendaItemElement) {
    const detailsPanel = document.getElementById('agenda-point-details');
    if (!detailsPanel) return;

    // Update urgency badge in details panel
    const urgencyBadge = agendaItemElement.querySelector('.agenda-point-urgency');
    if (urgencyBadge) {
      const urgencyText = urgencyBadge.textContent.trim();
      const detailsUrgencyBadge = detailsPanel.querySelector('.setPointUrgency .badge');
      if (detailsUrgencyBadge) {
        detailsUrgencyBadge.textContent = urgencyText;

        // Update urgency class based on the urgency level
        detailsUrgencyBadge.className = 'badge';
        const urgencyLevel = this.urgencyLevels.find(level => level.label === urgencyText);
        if (urgencyLevel) {
          detailsUrgencyBadge.classList.add(urgencyLevel.class.replace('text-', 'text-bg-'));
        } else {
          detailsUrgencyBadge.classList.add('text-bg-primary');
        }
      }
    }
  }

  /**
   * Update the urgency level of the current agenda point
   * @param {string} urgencyLevel - The urgency level to set
   */
  /**
   * Update the urgency level of the current agenda point
   * @param {string} urgencyLevel - The urgency level to set
   */
  updateAgendaPointUrgency(urgencyLevel) {
    const {
      currentAgendaId,
      agendaItems,
      urgencyLevels,
      defaultUrgency
    } = this.state;

    if (!currentAgendaId || !agendaItems.has(currentAgendaId)) return;

    // Find the urgency level or fall back to default
    const urgency = urgencyLevels.find(level => level.id === urgencyLevel) ||
      urgencyLevels.find(level => level.id === defaultUrgency);

    if (!urgency) return;

    // Update the state
    const agendaItem = agendaItems.get(currentAgendaId);
    agendaItem.urgency = urgency.id;
    agendaItems.set(currentAgendaId, agendaItem);

    // Update the UI
    this.updateAgendaItemUI(currentAgendaId);

    // Update the background color based on urgency
    this.updateAgendaItemBackground(currentAgendaId, urgency.bgClass);

    // If this is the currently selected item, update the border class and details panel
    if (currentAgendaId === this.state.currentAgendaId) {
      const agendaElement = document.querySelector(`[data-agenda-id="${currentAgendaId}"]`);
      if (agendaElement) {
        // Remove all border classes and add the new urgency-based border
        const allBorderClasses = ['border-dark', 'border-secondary', 'border-primary', 'border-warning', 'border-danger'];
        agendaElement.classList.remove(...allBorderClasses);
        agendaElement.classList.add(urgency.borderClass);
      }
      this.updateDetailsPanelUI(agendaItem);
    }
  }

  /**
   * Set up description editing functionality
   */
  setupDescriptionEditing() {
    // Use event delegation for dynamically added elements
    // Store a reference to the handler so we can remove it later if needed
    this._handleDescriptionClick = (e) => {
      const descElement = e.target.closest('.agenda-description');
      if (descElement) {
        this.handleDescriptionClick(descElement);
      }
    };

    this._handleDescriptionInput = (e) => {
      const descElement = e.target.closest('.agenda-description');
      if (descElement && descElement.isContentEditable) {
        this.updateDescriptionInRealtime(descElement);
      }
    };

    this._handleDescriptionBlur = (e) => {
      const descElement = e.target.closest('.agenda-description');
      if (descElement && descElement.isContentEditable) {
        this.finishDescriptionEditing(descElement, false);
      }
    };

    this._handleDescriptionKeydown = (e) => {
      const descElement = e.target.closest('.agenda-description');
      if (descElement && descElement.isContentEditable) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.finishDescriptionEditing(descElement, true);
        } else if (e.key === 'Escape') {
          this.cancelDescriptionEditing(descElement);
        }
      }
    };

    // Add event listeners
    document.addEventListener('dblclick', this._handleDescriptionClick);
    document.addEventListener('input', this._handleDescriptionInput, true);
    document.addEventListener('blur', this._handleDescriptionBlur, true);
    document.addEventListener('keydown', this._handleDescriptionKeydown, true);
  }

  /**
   * Handle description click to start editing
   * @param {HTMLElement} descElement - The clicked description element
   */
  handleDescriptionClick(descElement) {
    // If already editing, don't do anything
    if (descElement.isContentEditable) return;

    // Store original text and set contenteditable
    descElement.dataset.originalText = descElement.textContent.trim();
    descElement.contentEditable = true;

    // Add editing styles
    descElement.classList.add('editing');
    descElement.style.outline = '1px solid var(--bs-primary)';
    descElement.style.padding = '8px';
    descElement.style.borderRadius = '4px';

    // Focus and place cursor at the end
    descElement.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(descElement);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Update description in state as user types
   * @param {HTMLElement} descElement - The description element being edited
   */
  updateDescriptionInRealtime(descElement) {
    const newDescription = descElement.textContent.trim();
    const agendaItem = descElement.closest('[data-agenda-id]');

    if (agendaItem) {
      const agendaId = agendaItem.dataset.agendaId;
      const agendaData = this.state.agendaItems.get(agendaId);

      if (agendaData) {
        agendaData.description = newDescription;
        this.state.agendaItems.set(agendaId, agendaData);
        this.updateAgendaItemUI(agendaId);
      }
    }
  }

  /**
   * Cancel the current description editing session
   * @param {HTMLElement} descElement - The description element being edited
   */
  cancelDescriptionEditing(descElement) {
    descElement.textContent = descElement.dataset.originalText || '';
    this.finishDescriptionEditing(descElement, true);
  }

  /**
   * Finish editing a description
   * @param {HTMLElement} descElement - The description element being edited
   * @param {boolean} shouldBlur - Whether to remove focus after saving
   */
  finishDescriptionEditing(descElement, shouldBlur) {
    const newDescription = descElement.textContent.trim();
    const agendaItem = descElement.closest('[data-agenda-id]');

    if (agendaItem) {
      const agendaId = agendaItem.dataset.agendaId;
      const agendaData = this.state.agendaItems.get(agendaId);

      if (agendaData) {
        agendaData.description = newDescription;
        this.state.agendaItems.set(agendaId, agendaData);
      } else if (!newDescription) {
        // Restore original description if empty
        descElement.textContent = descElement.dataset.originalText || '';
      }
    }

    // Clean up
    descElement.contentEditable = false;
    descElement.classList.remove('editing');
    descElement.style.outline = '';
    descElement.style.padding = '';
    descElement.style.borderRadius = '';
    descElement.style.boxShadow = '';
    descElement.style.minHeight = '';

    if (shouldBlur) {
      descElement.blur();
    }
  }

  /**
   * Set up title editing functionality
   */
  setupTitleEditing() {
    // Use event delegation for dynamically added elements
    document.addEventListener('dblclick', (e) => {
      const titleElement = e.target.closest('.agenda-title, .minimized-title, #agenda-point-title.agenda-point-title');
      if (titleElement) {
        this.handleTitleClick(titleElement);
      }
    });

    // Handle input events for real-time updates
    document.addEventListener('input', (e) => {
      const titleElement = e.target.closest('.agenda-title, .minimized-title, #agenda-point-title.agenda-point-title');
      if (titleElement && titleElement.isContentEditable) {
        this.updateTitleInRealtime(titleElement);
      }
    }, true);

    // Handle blur and keydown events for editable titles
    document.addEventListener('blur', (e) => {
      const titleElement = e.target.closest('.agenda-title, .minimized-title, #agenda-point-title.agenda-point-title');
      if (titleElement && titleElement.isContentEditable) {
        this.finishEditing(titleElement, false);
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      const titleElement = e.target.closest('.agenda-title, .minimized-title, #agenda-point-title.agenda-point-title');
      if (titleElement && titleElement.isContentEditable) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.finishEditing(titleElement, true);
        } else if (e.key === 'Escape') {
          this.cancelEditing(titleElement);
        }
      }
    }, true);
  }

  /**
   * Cancel the current editing session and restore original text
   * @param {HTMLElement} titleElement - The title element being edited
   */
  cancelEditing(titleElement) {
    titleElement.textContent = titleElement.dataset.originalText || '';
    this.finishEditing(titleElement, true);
  }

  /**
   * Update all instances of a title in real-time as the user types
   * @param {HTMLElement} titleElement - The title element being edited
   */
  updateTitleInRealtime(titleElement) {
    const newTitle = titleElement.textContent.trim();
    let agendaItem = this.getAgendaItemFromElement(titleElement);

    if (agendaItem) {
      const agendaId = agendaItem.dataset.agendaId;
      const agendaData = this.state.agendaItems.get(agendaId);

      if (agendaData) {
        // Update all title elements except the one being edited
        this.updateAllTitleElements(agendaId, newTitle, titleElement);
      }
    }
  }

  /**
   * Get the agenda item element from a title element
   * @param {HTMLElement} titleElement - The title element
   * @returns {HTMLElement|null} - The parent agenda item element or null if not found
   */
  getAgendaItemFromElement(titleElement) {
    // If this is the details panel title, find the current agenda item
    if (titleElement.id === 'agenda-point-title') {
      const currentAgendaId = this.state.currentAgendaId;
      if (currentAgendaId) {
        return document.querySelector(`[data-agenda-id="${currentAgendaId}"]`);
      }
    }
    // Otherwise, find the closest agenda item
    return titleElement.closest('[data-agenda-id]');
  }

  /**
   * Handle title click to start editing
   * @param {HTMLElement} titleElement - The clicked title element
   */
  handleTitleClick(titleElement) {
    // If already editing, don't do anything
    if (titleElement.isContentEditable) return;

    // Store original text and set contenteditable
    titleElement.dataset.originalText = titleElement.textContent.trim();
    titleElement.contentEditable = true;

    // Add editing styles
    titleElement.classList.add('editing');
    titleElement.style.outline = '2px solid var(--bs-primary)';
    titleElement.style.padding = '4px 8px';
    titleElement.style.borderRadius = '4px';
    titleElement.style.boxShadow = '0 0 0 2px rgba(13, 110, 253, 0.25)';

    titleElement.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(titleElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Finish editing a title
   * @param {HTMLElement} titleElement - The title element being edited
   * @param {boolean} shouldBlur - Whether to remove focus after saving
   */
  finishEditing(titleElement, shouldBlur) {
    const newTitle = titleElement.textContent.trim();
    let agendaItem = titleElement.closest('[data-agenda-id]');

    // If this is the details panel title, find the corresponding agenda item
    if (!agendaItem && titleElement.id === 'agenda-point-title') {
      const currentAgendaId = this.state.currentAgendaId;
      if (currentAgendaId) {
        agendaItem = document.querySelector(`[data-agenda-id="${currentAgendaId}"]`);
      }
    }

    if (agendaItem) {
      const agendaId = agendaItem.dataset.agendaId;
      const agendaData = this.state.agendaItems.get(agendaId);

      if (agendaData && newTitle && newTitle !== agendaData.title) {
        // Update the title in the state
        agendaData.title = newTitle;
        this.state.agendaItems.set(agendaId, agendaData);
        this.updateAgendaItemUI(agendaId);

        // Update all title elements for this agenda item
        this.updateAllTitleElements(agendaId, newTitle);
      } else if (!newTitle) {
        // Restore original title if empty
        titleElement.textContent = titleElement.dataset.originalText || agendaData?.title || '';
      }
    }

    // Clean up
    titleElement.contentEditable = false;
    titleElement.classList.remove('editing');
    titleElement.style.outline = '';
    titleElement.style.padding = '';
    titleElement.style.borderRadius = '';
    titleElement.style.boxShadow = '';

    if (shouldBlur) {
      titleElement.blur();
    }
  }

  /**
   * Update all title elements for an agenda item
   * @param {string} agendaId - The ID of the agenda item
   * @param {string} newTitle - The new title text
   * @param {HTMLElement} [excludeElement] - Optional element to exclude from updates
   */
  updateAllTitleElements(agendaId, newTitle, excludeElement = null) {
    const agendaItem = document.querySelector(`[data-agenda-id="${agendaId}"]`);

    // Get all title elements to update
    const titleElements = [];

    // Add main title and minimized title from the agenda item
    if (agendaItem) {
      titleElements.push(
        ...agendaItem.querySelectorAll('.agenda-title, .minimized-title')
      );
    }

    // Add the details panel title
    const detailsPanel = document.querySelector('#agenda-point-details');
    if (detailsPanel) {
      const detailTitle = detailsPanel.querySelector('#agenda-point-title');
      if (detailTitle) {
        titleElements.push(detailTitle);
      }
    }

    // Update all titles that aren't the excluded element and aren't currently being edited
    titleElements.forEach(element => {
      if (element !== excludeElement && !element.isContentEditable) {
        element.textContent = newTitle;
      }
    });
  }

  /**
   * Show the audio recording modal
   */
  showAudioRecordingModal() {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'audioRecordingModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'audioRecordingModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="audioRecordingModalLabel">
                            <i class="ti ti-microphone me-2"></i>
                            Record Voice Clip
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div id="recording-status" class="mb-4">
                            <div class="recording-indicator d-none mb-3">
                                <div class="recording-pulse"></div>
                                <p class="text-danger mb-0">Recording...</p>
                                <p class="text-muted small" id="recording-timer">00:00</p>
                            </div>
                            <div class="ready-indicator">
                                <i class="ti ti-microphone fs-1 text-muted mb-3"></i>
                                <p class="text-muted">Click the record button to start recording</p>
                            </div>
                        </div>
                        
                        <div class="recording-controls mb-4">
                            <button type="button" class="btn btn-danger btn-lg me-3" id="startRecordingBtn">
                                <i class="ti ti-circle fs-5 me-2"></i>Record
                            </button>
                            <button type="button" class="btn btn-secondary btn-lg d-none" id="stopRecordingBtn">
                                <i class="ti ti-square fs-5 me-2"></i>Stop
                            </button>
                        </div>
                        
                        <div id="audio-preview" class="d-none">
                            <h6 class="mb-3">Preview Recording</h6>
                            <div class="audio-player bg-light p-3 rounded mb-3">
                                <audio id="previewAudio" controls class="w-100"></audio>
                            </div>
                            <div class="d-flex justify-content-center gap-2">
                                <button type="button" class="btn btn-outline-secondary" id="retryRecordingBtn">
                                    <i class="ti ti-refresh me-2"></i>Record Again
                                </button>
                                <button type="button" class="btn btn-primary" id="saveRecordingBtn">
                                    <i class="ti ti-check me-2"></i>Save Recording
                                </button>
                            </div>
                        </div>
                        
                        <div id="recording-error" class="d-none">
                            <div class="alert alert-danger">
                                <i class="ti ti-alert-circle me-2"></i>
                                <span id="error-message">Unable to access microphone. Please check your permissions.</span>
                            </div>
                            <button type="button" class="btn btn-outline-primary" id="retryPermissionBtn">
                                <i class="ti ti-refresh me-2"></i>Try Again
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <small class="text-muted me-auto">
                            <i class="ti ti-info-circle me-1"></i>
                            Maximum recording time: 5 minutes
                        </small>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;

    // Add modal to document
    document.body.appendChild(modal);

    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Initialize recording functionality
    this.initializeAudioRecording(modal);

    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', () => {
      this.cleanupAudioRecording();
      document.body.removeChild(modal);
    });
  }

  /**
   * Initialize audio recording functionality
   * @param {HTMLElement} modal - The modal containing the recording interface
   */
  initializeAudioRecording(modal) {
    const startBtn = modal.querySelector('#startRecordingBtn');
    const stopBtn = modal.querySelector('#stopRecordingBtn');
    const retryBtn = modal.querySelector('#retryRecordingBtn');
    const saveBtn = modal.querySelector('#saveRecordingBtn');
    const retryPermissionBtn = modal.querySelector('#retryPermissionBtn');
    const previewAudio = modal.querySelector('#previewAudio');

    const recordingIndicator = modal.querySelector('.recording-indicator');
    const readyIndicator = modal.querySelector('.ready-indicator');
    const audioPreview = modal.querySelector('#audio-preview');
    const recordingError = modal.querySelector('#recording-error');
    const recordingTimer = modal.querySelector('#recording-timer');

    let recordingStartTime = null;
    let timerInterval = null;

    // Start recording handler
    const startRecording = async () => {
      try {
        this.state.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        this.state.audioRecorder = new MediaRecorder(this.state.audioStream, {
          mimeType: 'audio/webm; codecs=opus'
        });
        this.state.audioChunks = [];

        this.state.audioRecorder.ondataavailable = (event) => {
          this.state.audioChunks.push(event.data);
        };

        this.state.audioRecorder.onstop = () => {
          // Calculate actual recording duration
          const actualDuration = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 0;
          this.state.recordingDuration = actualDuration;

          const audioBlob = new Blob(this.state.audioChunks, {
            type: 'audio/webm'
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          previewAudio.src = audioUrl;

          // Show preview
          recordingIndicator.classList.add('d-none');
          audioPreview.classList.remove('d-none');

          // Stop timer
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
        };

        // Start recording
        this.state.audioRecorder.start();
        this.state.isRecording = true;
        recordingStartTime = Date.now();

        // Update UI
        readyIndicator.classList.add('d-none');
        recordingIndicator.classList.remove('d-none');
        startBtn.classList.add('d-none');
        stopBtn.classList.remove('d-none');

        // Start timer
        timerInterval = setInterval(() => {
          const elapsed = Date.now() - recordingStartTime;
          const minutes = Math.floor(elapsed / 60000);
          const seconds = Math.floor((elapsed % 60000) / 1000);
          recordingTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          // Auto-stop at 5 minutes
          if (elapsed >= 300000) {
            stopRecording();
          }
        }, 1000);

      } catch (error) {
        console.error('Error starting recording:', error);
        // Fallback to default MediaRecorder if codec not supported
        try {
          this.state.audioRecorder = new MediaRecorder(this.state.audioStream);
          // ... rest of the setup
        } catch (fallbackError) {
          this.showRecordingError(modal, 'Unable to access microphone. Please check your permissions and try again.');
        }
      }
    };

    // Stop recording handler
    const stopRecording = () => {
      if (this.state.audioRecorder && this.state.isRecording) {
        this.state.audioRecorder.stop();
        this.state.isRecording = false;

        // Calculate final duration
        if (recordingStartTime) {
          this.state.recordingDuration = (Date.now() - recordingStartTime) / 1000;
        }

        // Update UI
        stopBtn.classList.add('d-none');
        startBtn.classList.remove('d-none');

        // Stop timer
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    };

    // Retry recording handler
    const retryRecording = () => {
      audioPreview.classList.add('d-none');
      readyIndicator.classList.remove('d-none');
      previewAudio.src = '';
      recordingTimer.textContent = '00:00';
    };

    // Save recording handler
    const saveRecording = () => {
      if (this.state.audioChunks.length > 0) {
        const audioBlob = new Blob(this.state.audioChunks, {
          type: 'audio/wav'
        });
        this.saveAudioClip(audioBlob);

        // Close modal
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
      }
    };

    // Retry permission handler
    const retryPermission = () => {
      recordingError.classList.add('d-none');
      readyIndicator.classList.remove('d-none');
    };

    // Add event listeners
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    retryBtn.addEventListener('click', retryRecording);
    saveBtn.addEventListener('click', saveRecording);
    retryPermissionBtn.addEventListener('click', retryPermission);
  }

  /**
   * Show recording error message
   * @param {HTMLElement} modal - The modal element
   * @param {string} message - The error message to display
   */
  showRecordingError(modal, message) {
    const recordingError = modal.querySelector('#recording-error');
    const errorMessage = modal.querySelector('#error-message');
    const readyIndicator = modal.querySelector('.ready-indicator');
    const recordingIndicator = modal.querySelector('.recording-indicator');

    readyIndicator.classList.add('d-none');
    recordingIndicator.classList.add('d-none');
    errorMessage.textContent = message;
    recordingError.classList.remove('d-none');
  }

  /**
   * Save audio clip to the current agenda item
   * @param {Blob} audioBlob - The recorded audio blob
   */
  saveAudioClip(audioBlob) {
    const agendaId = this.state.currentAgendaId;
    if (!agendaId) return;

    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    // Create audio clip object
    const audioId = this.generateAudioId();

    // Calculate estimated duration from recording time
    const recordingDuration = this.state.recordingDuration || 0; // We'll track this during recording

    const audioClip = {
      id: audioId,
      userId: 'current-user',
      userName: 'Current User',
      userImage: 'https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg',
      audioBlob: audioBlob,
      audioUrl: URL.createObjectURL(audioBlob),
      duration: recordingDuration, // Use recorded duration as fallback
      estimatedDuration: recordingDuration, // Store estimated duration
      createdAt: new Date().toISOString(),
      isApproved: false
    };

    // Initialize audio clips array if it doesn't exist
    if (!agendaItem.audioClips) {
      agendaItem.audioClips = [];
    }

    // Add audio clip to agenda item
    agendaItem.audioClips.push(audioClip);
    this.state.agendaItems.set(agendaId, agendaItem);

    // Re-render the threads to include the new audio clip
    this.renderThreads(agendaItem);

    // Update audio clip count
    this.updateAudioClipCount(agendaItem);

    // Show success message
    this.showToast('Voice clip saved successfully', 'success');
  }

  /**
   * Generate a unique ID for an audio clip
   * @returns {string} A unique audio clip ID
   */
  generateAudioId() {
    return 'audio-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  /**
   * Cleanup audio recording resources
   */
  cleanupAudioRecording() {
    if (this.state.audioStream) {
      this.state.audioStream.getTracks().forEach(track => track.stop());
      this.state.audioStream = null;
    }

    if (this.state.audioRecorder) {
      this.state.audioRecorder = null;
    }

    this.state.audioChunks = [];
    this.state.isRecording = false;
  }

  /**
   * Render audio clips for the current agenda item (integrated into threads)
   * @param {Object} agendaItem - The agenda item with audio clips
   * @param {HTMLElement} threadsContainer - The threads container to append audio clips to
   */
  renderAudioClips(agendaItem, threadsContainer) {
    if (!agendaItem.audioClips || agendaItem.audioClips.length === 0 || !threadsContainer) {
      return;
    }

    // Sort audio clips by creation date (same as threads)
    const sortedAudioClips = [...agendaItem.audioClips].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateA - dateB;
    });

    // Render each audio clip as a thread-like item
    sortedAudioClips.forEach(audioClip => {
      const formattedDate = this.formatDate(audioClip.createdAt);
      const isApproved = audioClip.isApproved === true;

      const audioElement = document.createElement('div');
      audioElement.className = `agenda-audio-clip agenda-thread-post mb-2 rounded-3 ${isApproved ? 'approved-audio' : ''}`;
      audioElement.dataset.audioId = audioClip.id;

      audioElement.innerHTML = `
                <div class="d-flex gap-3">
                    <div class="flex-shrink-0">
                        <img src="${audioClip.userImage}" class="rounded-circle" width="40" height="40" alt="User">
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0 fw-semibold">
                                <i class="ti ti-microphone me-2 text-primary"></i>
                                ${audioClip.userName}
                            </h6>
                            <small class="text-muted" title="${new Date(audioClip.createdAt).toLocaleString()}">
                                ${formattedDate}
                            </small>
                        </div>
                        
                        <div class="audio-player-container mb-2">
                            <div class="d-flex align-items-center gap-3 p-3 rounded">
                                <button class="btn mb-1 btn-primary rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center audio-play-btn" data-audio-id="${audioClip.id}">
                                    <i class="ti ti-player-play fs-6"></i>
                                </button>
                                <div class="flex-grow-1">
                                    <div class="audio-waveform bg-white rounded" style="height: 30px; position: relative;">
                                        <div class="audio-progress bg-primary rounded" style="height: 100%; width: 0%; transition: width 0.1s;"></div>
                                        <div class="audio-time-display position-absolute top-50 start-50 translate-middle">
                                            <small class="text-muted">00:00</small>
                                        </div>
                                    </div>
                                    <audio src="${audioClip.audioUrl}" preload="metadata" style="display: none;"></audio>
                                </div>
                                <div class="audio-duration">
                                    <small class="text-muted" id="duration-${audioClip.id}">--:--</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="audio-actions d-flex align-items-center">
                            <div class="d-flex align-items-center gap-2">
                                <a class="approve-audio p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${isApproved ? 'Approved' : 'Approve'}">
                                    <i class="ti ${isApproved ? 'ti-star-filled text-warning' : 'ti-star text-muted'} fs-4"></i>
                                </a>
                            </div>
                            <div class="d-flex align-items-center gap-2 ms-4">
                                <a class="delete-audio p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                    <i class="ti ti-trash text-danger fs-4"></i>
                                </a>
                            </div>
                            <a class="connect-audio-action text-dark ms-auto d-flex align-items-center justify-content-center bg-transparent p-2 fs-4 rounded-circle" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Create an action">
                                <i class="ti ti-steam"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;

      threadsContainer.appendChild(audioElement);

      // Initialize waveform audio player functionality
      this.initializeWaveformAudioPlayer(audioElement, audioClip);

      // Initialize tooltips
      const tooltipTriggerList = audioElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    });
  }

  /**
   * Initialize waveform audio player functionality for an audio clip
   * @param {HTMLElement} audioElement - The audio clip DOM element
   * @param {Object} audioClip - The audio clip data
   */
  async initializeWaveformAudioPlayer(audioElement, audioClip) {
    // Use the global waveform audio player instance
    if (window.waveformAudioPlayer) {
      await window.waveformAudioPlayer.initializeWaveformPlayer(audioElement, audioClip);
    } else {
      console.warn('Waveform audio player not available, falling back to basic player');
      this.initializeAudioPlayer(audioElement, audioClip);
    }
  }

  /**
   * Initialize audio player functionality for an audio clip (fallback)
   * @param {HTMLElement} audioElement - The audio clip DOM element
   * @param {Object} audioClip - The audio clip data
   */
  initializeAudioPlayer(audioElement, audioClip) {
    const playBtn = audioElement.querySelector('.audio-play-btn');
    const audioPlayer = audioElement.querySelector('audio');
    const progressBar = audioElement.querySelector('.audio-progress');
    const timeDisplay = audioElement.querySelector('.audio-time-display small');
    const durationDisplay = audioElement.querySelector(`#duration-${audioClip.id}`);

    let isPlaying = false;
    let durationSet = false;

    // Function to format time safely
    const formatTime = (timeValue) => {
      if (!timeValue || !isFinite(timeValue) || isNaN(timeValue) || timeValue <= 0) {
        return '00:00';
      }
      const minutes = Math.floor(timeValue / 60);
      const seconds = Math.floor(timeValue % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Function to update duration display
    const updateDuration = () => {
      if (durationSet) return;

      const duration = audioPlayer.duration;

      if (isFinite(duration) && !isNaN(duration) && duration > 0) {
        durationDisplay.textContent = formatTime(duration);
        durationSet = true;
        return true;
      }
      return false;
    };

    // Use estimated duration as initial display
    if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
      durationDisplay.textContent = formatTime(audioClip.estimatedDuration);
      durationSet = true;
    }

    // Set up audio source properly
    if (audioClip.audioBlob) {
      // If we have the blob, create a fresh URL
      if (audioClip.audioUrl) {
        URL.revokeObjectURL(audioClip.audioUrl);
      }
      audioClip.audioUrl = URL.createObjectURL(audioClip.audioBlob);
      audioPlayer.src = audioClip.audioUrl;
    } else if (audioClip.audioUrl) {
      audioPlayer.src = audioClip.audioUrl;
    }

    // Multiple event listeners to catch duration
    audioPlayer.addEventListener('loadedmetadata', () => {
      updateDuration();
    });

    audioPlayer.addEventListener('loadeddata', () => {
      updateDuration();
    });

    audioPlayer.addEventListener('canplay', () => {
      updateDuration();
    });

    audioPlayer.addEventListener('canplaythrough', () => {
      updateDuration();
    });

    // Fallback: Check duration periodically for a short time
    let attempts = 0;
    const checkDuration = () => {
      if (durationSet) return; // Don't continue checking if duration is already set

      attempts++;
      const duration = audioPlayer.duration;

      if (isFinite(duration) && !isNaN(duration) && duration > 0) {
        durationDisplay.textContent = formatTime(duration);
        durationSet = true;
      } else if (attempts < 10) {
        // Try again in 500ms, up to 10 times (5 seconds total)
        setTimeout(checkDuration, 500);
      } else {
        console.warn('Could not get audio duration after 10 attempts for:', audioClip.id);
        // Only set --:-- if we don't have an estimated duration
        if (!audioClip.estimatedDuration || audioClip.estimatedDuration <= 0) {
          durationDisplay.textContent = '--:--';
        }
      }
    };

    // Start checking after a short delay
    setTimeout(checkDuration, 100);

    // Handle errors loading audio
    audioPlayer.addEventListener('error', (e) => {
      console.warn('Audio loading error for', audioClip.id, ':', e);
      durationDisplay.textContent = '--:--';
      timeDisplay.textContent = '00:00';
    });

    // Update progress during playback
    audioPlayer.addEventListener('timeupdate', () => {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration;

      // Always update current time display
      timeDisplay.textContent = formatTime(currentTime);

      // Use actual duration if available, otherwise fall back to estimated duration
      let effectiveDuration = null;
      if (isFinite(duration) && !isNaN(duration) && duration > 0) {
        effectiveDuration = duration;
        // Update duration display with actual duration if not set yet
        if (!durationSet) {
          durationDisplay.textContent = formatTime(duration);
          durationSet = true;
        }
      } else if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
        effectiveDuration = audioClip.estimatedDuration;
      }

      // Update progress bar using effective duration
      if (effectiveDuration && effectiveDuration > 0) {
        const progress = (currentTime / effectiveDuration) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      } else {
        progressBar.style.width = '0%';
      }
    });

    // Handle play/pause button
    playBtn.addEventListener('click', async () => {
      try {
        if (isPlaying) {
          audioPlayer.pause();
          playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
          isPlaying = false;
        } else {
          // Pause any other playing audio
          document.querySelectorAll('.agenda-audio-clip audio').forEach(audio => {
            if (audio !== audioPlayer) {
              audio.pause();
            }
          });
          document.querySelectorAll('.audio-play-btn').forEach(btn => {
            if (btn !== playBtn) {
              btn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
            }
          });

          await audioPlayer.play();
          playBtn.innerHTML = '<i class="ti ti-player-pause fs-6"></i>';
          isPlaying = true;
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
        isPlaying = false;
      }
    });

    // Reset button when audio ends
    audioPlayer.addEventListener('ended', () => {
      playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
      progressBar.style.width = '0%';
      timeDisplay.textContent = '00:00';
      isPlaying = false;
    });

    // Handle clicking on progress bar to seek
    const waveform = audioElement.querySelector('.audio-waveform');
    waveform.addEventListener('click', (e) => {
      const duration = audioPlayer.duration;
      let effectiveDuration = null;

      // Use actual duration if available, otherwise fall back to estimated duration
      if (isFinite(duration) && !isNaN(duration) && duration > 0) {
        effectiveDuration = duration;
      } else if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
        effectiveDuration = audioClip.estimatedDuration;
      }

      if (effectiveDuration && effectiveDuration > 0) {
        const rect = waveform.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = clickX / rect.width;
        audioPlayer.currentTime = progress * effectiveDuration;
      }
    });

    // Force load the audio metadata
    audioPlayer.load();
  }

  /**
   * Update the audio clip count in the UI
   * @param {Object} agendaItem - The agenda item with audio clips
   */
  updateAudioClipCount(agendaItem) {
    const audioCount = agendaItem.audioClips ? agendaItem.audioClips.length : 0;

    // Update audio count in the agenda item footer (if we add one)
    const agendaItemElement = document.querySelector(`[data-agenda-id="${agendaItem.id}"]`);
    if (agendaItemElement) {
      // For now, we could add this to the existing footer or create a new indicator
      // This is optional based on UI design preferences
    }
  }

  /**
   * Handle the selected files
   * @param {FileList} files - The files selected by the user
   */
  handleFileUpload(files) {
    const agendaId = this.state.currentAgendaId;
    if (!agendaId) return;

    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    if (!agendaItem.files) {
      agendaItem.files = [];
    }

    for (const file of files) {
      const newFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
      agendaItem.files.push(newFile);
    }

    this.state.agendaItems.set(agendaId, agendaItem);
    this.renderFiles(agendaItem);
  }

  /**
   * Update the UI for a specific agenda item
   * @param {string} agendaId - The ID of the agenda item to update
   */
  updateAgendaItemUI(agendaId) {
    const {
      agendaItems,
      urgencyLevels
    } = this.state;
    const agendaItem = agendaItems.get(agendaId);
    if (!agendaItem) return;

    const urgency = urgencyLevels.find(level => level.id === agendaItem.urgency) ||
      urgencyLevels.find(level => level.id === this.state.defaultUrgency);

    const agendaElement = document.querySelector(`[data-agenda-id="${agendaId}"]`);
    if (!agendaElement) return;

    // Update the urgency badge in the list
    const urgencyBadge = agendaElement.querySelector('.agenda-point-urgency');
    if (urgencyBadge && urgency) {
      console.log('UPDATING URGENCY');
      urgencyBadge.textContent = urgency.label;
      // Remove all possible urgency classes before adding the new one
      urgencyBadge.className = 'mb-1 badge rounded-pill agenda-point-urgency';
      const urgencyClasses = ['text-bg-muted','text-bg-secondary','text-bg-primary','text-bg-warning','text-bg-danger'];
      urgencyBadge.classList.remove(...urgencyClasses);
      urgencyBadge.classList.add(urgency.class.replace('text-', 'text-bg-'));
    }

    // Update the background color based on urgency
    this.updateAgendaItemBackground(agendaId, urgency.bgClass);

    // Ensure titles are in sync
    this.updateAllTitleElements(agendaId, agendaItem.title);
  }

  /**
   * Update the background color of an agenda item
   * @param {string} agendaId - The ID of the agenda item to update
   * @param {string} bgClass - The background class to apply
   */
  updateAgendaItemBackground(agendaId, bgClass) {
    const agendaElement = document.querySelector(`[data-agenda-id="${agendaId}"]`);
    if (!agendaElement) return;

    // Remove all existing background classes
    const bgClasses = ['bg-dark-super-subtle', 'bg-secondary-super-subtle',
      'bg-primary-super-subtle', 'bg-warning-super-subtle', 'bg-danger-super-subtle'
    ];
    agendaElement.classList.remove(...bgClasses);

    // Add the new background class
    if (bgClass) {
      agendaElement.classList.add(bgClass);

      // Update the meenoe-agenda-details background to match
      const agendaDetails = document.getElementById('meenoe-agenda-details');
      if (agendaDetails) {
        // Remove all existing background classes
        agendaDetails.classList.remove(...bgClasses);
        // Add the new background class
        agendaDetails.classList.add(bgClass);
      }
    }
  }

  /**
   * Update the details panel UI with agenda item data
   * @param {Object} agendaItem - The agenda item data
   */
  updateDetailsPanelUI(agendaItem) {
    const {
      urgencyLevels,
      defaultUrgency
    } = this.state;
    const {
      detailsUrgencyPill
    } = this.state.elements;

    if (!detailsUrgencyPill) return;

    // Find the urgency level or fall back to default
    const urgency = agendaItem ? (urgencyLevels.find(level => level.id === agendaItem.urgency) || urgencyLevels.find(level => level.id === defaultUrgency)) : null;

    // Update urgency pill
    if (urgency) {
      detailsUrgencyPill.textContent = urgency.label;
      detailsUrgencyPill.className = 'badge';
      detailsUrgencyPill.classList.add(urgency.class.replace('text-', 'text-bg-'));
    } else {
      detailsUrgencyPill.textContent = 'No Urgency';
      detailsUrgencyPill.className = 'badge text-bg-secondary';
    }

    // Update description
    const descElement = document.querySelector('#agenda-point-description .thread-text');
    if (descElement) {
      descElement.textContent = agendaItem ? agendaItem.description || '' : '';
    }

    // Update the meenoe-agenda-details background to match the urgency level
    const agendaDetails = document.getElementById('meenoe-agenda-details');
    if (agendaDetails) {
      const bgClasses = ['bg-dark-super-subtle', 'bg-secondary-super-subtle', 'bg-primary-super-subtle', 'bg-warning-super-subtle', 'bg-danger-super-subtle'];
      agendaDetails.classList.remove(...bgClasses);
      if (urgency) {
        agendaDetails.classList.add(urgency.bgClass);
      }
    }

    // Update files (assuming a simple list for now)
    const filesContainer = document.querySelector('#agenda-point-files');
    if (filesContainer) {
      filesContainer.innerHTML = ''; // Clear existing files
      if (agendaItem && agendaItem.files && agendaItem.files.length > 0) {
        const fileList = document.createElement('ul');
        agendaItem.files.forEach(file => {
          const li = document.createElement('li');
          li.textContent = file.name;
          fileList.appendChild(li);
        });
        filesContainer.appendChild(fileList);
      }
    }

    // Note: Audio clips are now rendered directly in the threads area via renderThreads()
  }

  /**
   * Generate a unique ID for a thread
   * @returns {string} A unique thread ID
   */
  generateThreadId() {
    return 'thread-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  /**
   * Add a new thread to an agenda point
   * @param {string} agendaId - The ID of the agenda item
   */
  addNewThread(agendaId) {
    const agendaItem = this.state.agendaItems.get(agendaId);
    if (!agendaItem) return;

    // Create a new thread with a unique ID
    const threadId = this.generateThreadId();
    const newThread = {
      id: threadId,
      userId: 'current-user', // This would be replaced with actual user ID
      userName: 'Current User', // This would be replaced with actual user name
      userImage: 'https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg',
      content: '',
      createdAt: new Date().toISOString(),
      isEditing: true,
      isNew: true // Mark as new until saved
    };

    // Add thread to the agenda item
    if (!agendaItem.threads) {
      agendaItem.threads = [];
    }
    agendaItem.threads.push(newThread);
    this.state.agendaItems.set(agendaId, agendaItem);

    // Update the UI but don't update the thread count yet
    this.renderThreads(agendaItem);

    // Focus on the new thread
    setTimeout(() => {
      const threadElement = document.querySelector(`[data-thread-id="${threadId}"] .thread-text`);
      if (threadElement) {
        threadElement.focus();
      }
    }, 100);
  }

  /**
   * Save a thread
   * @param {HTMLElement} threadElement - The thread element to save
   */
  saveThread(threadElement) {
    const threadId = threadElement.dataset.threadId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.threads) return;

    const threadIndex = agendaItem.threads.findIndex(t => t.id === threadId);
    if (threadIndex === -1) return;

    // Get content from Quill editor if it exists, otherwise fall back to regular contenteditable
    let content = '';
    if (this.state.quillInstances.has(threadId)) {
      const quill = this.state.quillInstances.get(threadId);
      // For Quill 2.x, prefer getSemanticHTML if available
      if (typeof quill.getSemanticHTML === 'function') {
        content = quill.getSemanticHTML().trim();
      } else {
        content = quill.root.innerHTML.trim();
      }
      // Clean up Quill instance
      quill.off('text-change');
      this.state.quillInstances.delete(threadId);
    } else {
      const contentElement = threadElement.querySelector('.thread-text');
      if (!contentElement) return;
      content = contentElement.innerHTML.trim();
    }

    const isNewThread = agendaItem.threads[threadIndex].isNew;

    if (content) {
      const now = new Date().toISOString();
      agendaItem.threads[threadIndex].content = content;
      agendaItem.threads[threadIndex].isEditing = false;
      agendaItem.threads[threadIndex].updatedAt = now;

      if (!agendaItem.threads[threadIndex].createdAt) {
        agendaItem.threads[threadIndex].createdAt = now;
      }

      if (agendaItem.threads[threadIndex].originalContent !== undefined) {
        delete agendaItem.threads[threadIndex].originalContent;
      }

      if (isNewThread) {
        delete agendaItem.threads[threadIndex].isNew;
      }

      // Update the UI and thread count
      this.renderThreads(agendaItem);
      this.updateThreadCount(agendaItem);

      // Show success message
      this.showToast('Thread saved successfully', 'success');
    } else {
      // If content is empty, remove the thread
      this.removeThread(threadElement);
    }
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success, error, warning, info)
   */
  showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.id = toastId;

    // Toast content
    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

    // Add toast to container
    toastContainer.appendChild(toast);

    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
      autohide: true,
      delay: 3000
    });

    bsToast.show();

    // Remove toast from DOM after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  }

  /**
   * Remove a thread
   * @param {HTMLElement} threadElement - The thread element to remove
   */
  removeThread(threadElement) {
    if (!confirm('Are you sure you want to delete this thread?')) {
      return;
    }

    const threadId = threadElement.dataset.threadId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.threads) return;

    // Remove the thread from the agenda item
    agendaItem.threads = agendaItem.threads.filter(t => t.id !== threadId);
    this.state.agendaItems.set(agendaId, agendaItem);

    // Update the UI
    this.renderThreads(agendaItem);

    // Update the thread count in the details panel
    this.updateThreadCount(agendaItem);
  }

  /**
   * Enable editing for a thread
   * @param {HTMLElement} threadElement - The thread element to enable editing for
   */
  enableThreadEditing(threadElement) {
    const threadId = threadElement.dataset.threadId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.threads) return;

    // Set all threads to not editing first
    agendaItem.threads.forEach(t => {
      t.isEditing = false;
    });

    const thread = agendaItem.threads.find(t => t.id === threadId);
    if (!thread) return;

    // Store the current content in case of cancel
    const contentElement = threadElement.querySelector('.thread-text, .thread-content');
    if (contentElement) {
      thread.originalContent = contentElement.innerHTML.trim();
    }

    // Set the thread to editing mode
    thread.isEditing = true;

    // Update the UI
    this.renderThreads(agendaItem);

    // Initialize Quill editor after the DOM updates
    setTimeout(() => {
      const editorContainer = threadElement.querySelector('.thread-editor-container');
      if (!editorContainer) return;

      // Clean up any existing Quill instance on this container
      if (this.state.quillInstances.has(threadId)) {
        const oldQuill = this.state.quillInstances.get(threadId);
        oldQuill.off('text-change');
        this.state.quillInstances.delete(threadId);
      }

      // Official Quill.js Quickstart initialization
      const quill = new Quill(editorContainer, this.state.quillOptions);
      // Set initial content if it exists
      if (thread.content) {
        quill.clipboard.dangerouslyPasteHTML(thread.content);
      }

      // Store the Quill instance for later use
      this.state.quillInstances.set(threadId, quill);

      // Focus the editor
      quill.focus();

      // Keyboard shortcuts for save/cancel (Enter/Escape)
      quill.keyboard.addBinding({
        key: 'Enter',
        shiftKey: false,
        handler: () => {
          this.saveThread(threadElement);
          return false;
        }
      });
      quill.keyboard.addBinding({
        key: 'Escape',
        handler: () => {
          this.cancelEditThread(threadElement);
          return false;
        }
      });
    }, 0);


  }

  /**
   * Cancel editing a thread
   * @param {HTMLElement} threadElement - The thread element being edited
   */
  cancelEditThread(threadElement) {
    const threadId = threadElement.dataset.threadId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.threads) return;

    const thread = agendaItem.threads.find(t => t.id === threadId);
    if (!thread) return;

    if (thread.originalContent !== undefined) {
      // Restore original content if it was an edit
      thread.content = thread.originalContent;
      delete thread.originalContent;
    } else if (!thread.content || thread.content.trim() === '') {
      // If it was a new empty thread, remove it
      return this.removeThread(threadElement);
    }

    // Exit editing mode
    thread.isEditing = false;

    // Update the UI
    this.renderThreads(agendaItem);
  }

  /**
   * Toggle thread approval status (like feature)
   * @param {HTMLElement} threadElement - The thread element to toggle approval for
   */
  toggleThreadApproval(threadElement) {
    const threadId = threadElement.dataset.threadId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.threads) return;

    const thread = agendaItem.threads.find(t => t.id === threadId);
    if (!thread) return;

    // Use current user ID (replace with actual user ID logic if available)
    const currentUserId = (window.meenoeState && window.meenoeState.currentUserId) || 'current-user';

    // Initialize approvedBy array if not present
    if (!Array.isArray(thread.approvedBy)) thread.approvedBy = [];

    const userIndex = thread.approvedBy.indexOf(currentUserId);
    if (userIndex === -1) {
      // Approve: add user
      thread.approvedBy.push(currentUserId);
    } else {
      // Unapprove: remove user
      thread.approvedBy.splice(userIndex, 1);
    }

    // Save back to state
    this.state.agendaItems.set(agendaId, agendaItem);

    // Update the UI for this thread
    this.renderThreads(agendaItem);
  }

  /**
   * Create a new action from a thread
   * @param {HTMLElement} threadElement - The thread element to create an action from
   */
  connectActionToThread(threadElement) {
    try {
      // Get the agenda ID from the current state since we're in the details view
      const agendaId = this.state.currentAgendaId;
      if (!agendaId) {
        console.error('No agenda item is currently selected');
        return;
      }

      // Get the agenda item data from state
      const agendaItem = this.state.agendaItems.get(agendaId);
      if (!agendaItem) {
        console.error('Could not find agenda item data for ID:', agendaId);
        return;
      }

      // Get the thread index from the thread element
      const threadId = threadElement.dataset.threadId;
      if (!threadId) {
        console.error('Could not find thread ID');
        return;
      }

      // Find the thread in the agenda item's threads array
      const threadIndex = agendaItem.threads.findIndex(t => t.id === threadId);
      if (threadIndex === -1) {
        console.error('Could not find thread in agenda item');
        return;
      }

      const thread = agendaItem.threads[threadIndex];

      // Create a title that combines the agenda point name and thread number
      const threadNumber = threadIndex + 1;
      const actionTitle = `${agendaItem.title.trim()} - Thread ${threadNumber}`;

      // Create a new action using the tree object from meenoeInit.js
      if (typeof tree !== 'undefined' && tree) {
        // Check if we need to switch to default layout
        const layoutContainer = document.querySelector('.layout-container');
        const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');

        // If not in default layout, switch to it
        if (!isDefaultLayout) {
          // Find and click the default layout button
          const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
          if (defaultLayoutBtn) {
            defaultLayoutBtn.click();
          }
        }

        // Switch to the actions tab
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
          const tab = new bootstrap.Tab(actionsTab);
          tab.show();
        }

        // Create the action with the combined title
        const newAction = tree.createNode(
          actionTitle, // Action title
          false, // isRoot
          null, // parent
          null, // data
          null, // callback
          'context1' // context
        );

        // Scroll to the newly created action after a short delay to allow DOM updates
        setTimeout(() => {
          if (newAction && newAction.elementLi) {
            newAction.elementLi.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            // Add a highlight effect
            newAction.elementLi.classList.add('highlight-action');
            setTimeout(() => {
              newAction.elementLi.classList.remove('highlight-action');
            }, 2000);
          }
        }, 300);

        // Link the action to the agenda point (optional)
        if (newAction) {
          newAction.linkedAgenda = [agendaId];

          // Show success message
          this.showToast(`Created new action: ${actionTitle}`, 'success');

          // Redraw the tree to show the new action
          tree.drawTree();
        }
      } else {
        console.error('Tree object is not available');
        this.showToast('Failed to create action: Action system not available', 'error');
      }
    } catch (error) {
      console.error('Error creating action from thread:', error);
      this.showToast('Failed to create action', 'error');
    }
  }

  /**
   * Update the thread count in the UI
   * @param {Object} agendaItem - The agenda item with threads
   */
  updateThreadCount(agendaItem) {
    const threadCount = agendaItem.threads ? agendaItem.threads.length : 0;

    // Update thread count in the agenda item footer
    const agendaItemElement = document.querySelector(`[data-agenda-id="${agendaItem.id}"]`);
    if (agendaItemElement) {
      const threadCountElement = agendaItemElement.querySelector('.agenda-footer .d-flex.align-items-center.gap-2.ms-4 .fw-semibold');
      if (threadCountElement) {
        threadCountElement.textContent = `${threadCount} thread${threadCount !== 1 ? 's' : ''}`;
      }
    }

    // Update the thread count in the agenda footer
    const agendaFooter = document.getElementById('agenda-footer');
    if (agendaFooter) {
      const threadCountElement = agendaFooter.querySelector('.thread-count');
      if (threadCountElement) {
        threadCountElement.textContent = threadCount;
      }
    }
  }

  /**
   * Render threads for an agenda item
   * @param {Object} agendaItem - The agenda item with threads
   */
  renderThreads(agendaItem) {
    const threadsContainer = document.querySelector('.meenoethreads');
    if (!threadsContainer) {
      console.error('Threads container .meenoethreads not found');
      return;
    }

    // Clear existing threads and destroy any existing tooltips within the container
    const existingTooltips = threadsContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
    existingTooltips.forEach(tooltip => {
      const bsTooltip = bootstrap.Tooltip.getInstance(tooltip);
      if (bsTooltip) bsTooltip.dispose();
    });

    // Store any existing Quill instances that we want to preserve
    const activeQuillInstances = new Map();
    this.state.quillInstances.forEach((quill, threadId) => {
      const threadElement = threadsContainer.querySelector(`[data-thread-id="${threadId}"]`);
      if (threadElement) {
        activeQuillInstances.set(threadId, quill);
      } else {
        // Clean up unused Quill instances
        quill.off('text-change');
        this.state.quillInstances.delete(threadId);
      }
    });

    // Clear the container
    threadsContainer.innerHTML = '';

    // Check if we have any content to display
    const hasThreads = agendaItem?.threads?.length > 0;
    const hasAudioClips = agendaItem?.audioClips?.length > 0;

    if (!agendaItem || (!hasThreads && !hasAudioClips)) {
      threadsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="ti ti-message-2-off fs-5 text-muted"></i>
                    <p class="mt-2 text-muted">No threads yet. Be the first one to start the discussion.</p>
                </div>
            `;
      return;
    }

    // Create a combined array of threads and audio clips, then sort chronologically
    const allItems = [];

    // Add threads
    if (hasThreads) {
      agendaItem.threads.forEach(thread => {
        allItems.push({
          type: 'thread',
          data: thread,
          createdAt: new Date(thread.createdAt || 0)
        });
      });
    }

    // Add audio clips
    if (hasAudioClips) {
      agendaItem.audioClips.forEach(audioClip => {
        allItems.push({
          type: 'audio',
          data: audioClip,
          createdAt: new Date(audioClip.createdAt || 0)
        });
      });
    }

    // Sort all items by creation date (oldest first for chronological order)
    const sortedItems = allItems.sort((a, b) => a.createdAt - b.createdAt);

    // Render each item in chronological order
    sortedItems.forEach(item => {
      if (item.type === 'thread') {
        this.renderSingleThread(item.data, threadsContainer);
      } else if (item.type === 'audio') {
        this.renderSingleAudioClip(item.data, threadsContainer);
      }
    });
  }

  /**
   * Render a single thread item
   * @param {Object} thread - The thread data
   * @param {HTMLElement} threadsContainer - The container to append to
   */
  renderSingleThread(thread, threadsContainer) {
    const isEditing = thread.isEditing === true;
    const isNew = thread.isNew === true;
    // Approval logic
    const currentUserId = (window.meenoeState && window.meenoeState.currentUserId) || 'current-user';
    const approvedBy = Array.isArray(thread.approvedBy) ? thread.approvedBy : [];
    const isApproved = approvedBy.includes(currentUserId);
    const approveCount = approvedBy.length;
    const threadDate = thread.updatedAt || thread.createdAt || new Date().toISOString();
    const formattedDate = this.formatDate(threadDate);

    const threadElement = document.createElement('div');
    threadElement.className = `agenda-thread-post mb-2 rounded-3${isNew ? ' new-thread' : ''}${isApproved ? ' approved-thread' : ''}`;
    threadElement.dataset.threadId = thread.id;

    threadElement.innerHTML = `
            <div class="d-flex gap-3">
                <div class="flex-shrink-0">
                    <img src="${thread.userImage || 'https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg'}" 
                         class="rounded-circle" width="40" height="40" alt="User">
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0 fw-semibold">${thread.userName || 'User'}</h6>
                        <small class="text-muted" title="${new Date(threadDate).toLocaleString()}">
                            ${formattedDate}
                        </small>
                    </div>
                    
                    ${isEditing ? `
                        <div class="thread-editor-container mb-2"></div>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <a href="#" class="btn btn-sm btn-primary save-thread">
                                <i class="ti ti-device-floppy fs-6 me-1"></i> Save
                            </a>
                            <a href="#" class="btn btn-sm btn-outline-secondary cancel-thread">
                                <i class="ti ti-x fs-6 me-1"></i> Cancel
                            </a>
                            <div class="flex-grow-1"></div>
                            <a href="#" class="btn btn-sm p-0 text-muted connect-action ms-auto" data-bs-toggle="tooltip" title="Connect to Action">
                                <i class="ti ti-link fs-5"></i>
                            </a>
                        </div>
                    ` : `
                        <div class="thread-content mb-2 bg-thread-content rounded-2 px-3 py-2">
                            <div class="thread-text">
                                ${thread.content || ''}
                            </div>
                        </div>
                        <div class="thread-actions d-flex align-items-center">
                          <div class="d-flex align-items-center gap-2">
                            <a class="edit-thread p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="edit">
                              <i class="ti ti-edit fs-4 text-primary"></i>
                            </a>
                          </div>
                          <div class="d-flex align-items-center gap-2 ms-4">
                            <a class="approve-thread p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${isApproved ? 'Approved' : 'Approve'}">
                              <i class="ti ${isApproved ? 'ti-star-filled text-warning' : 'ti-star text-muted'} fs-4"></i>
                              <span class="ms-1 fw-semibold approve-count" style="font-size:1rem;">${approveCount > 0 ? approveCount : ''}</span>
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
                    `}
                </div>
            </div>
        `;

    threadsContainer.appendChild(threadElement);

    // Initialize tooltips for this new thread
    const tooltipTriggerList = threadElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Process file references in the content
    const fileReferences = threadElement.querySelectorAll('.file-reference, a[href][target="_blank"]');
    fileReferences.forEach(fileRef => {
      // Get filename from data attribute or from the link text
      const fileName = fileRef.getAttribute('data-file-name') || fileRef.textContent.trim();
      const fileSize = fileRef.getAttribute('data-file-size') || '0';
      const fileType = fileRef.getAttribute('data-file-type') || '';

      // If this is a converted link without the icon, restore the icon
      if (!fileRef.querySelector('i') && fileName) {
        // Get the icon class based on the file name
        const iconClass = this.getFileTypeIcon(fileName);

        // Create and add the icon element
        const iconElement = document.createElement('i');
        iconClass.split(' ').forEach(cls => iconElement.classList.add(cls));
        iconElement.classList.add('fs-4', 'me-1');

        // Add icon as the first child of the link
        fileRef.insertBefore(iconElement, fileRef.firstChild);
      }

      // Add click handler
      fileRef.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleFileReferenceClick(fileName, fileSize, fileType);
      });
    });

    // If this is a thread being edited, initialize Quill editor
    if (isEditing) {
      const editorContainer = threadElement.querySelector('.thread-editor-container');
      if (editorContainer) {
        // Clear any existing content in the container
        editorContainer.innerHTML = '';

        // Initialize Quill editor
        const quill = new Quill(editorContainer, this.state.quillOptions);

        // Set initial content if it exists
        if (thread.content) {
          quill.clipboard.dangerouslyPasteHTML(thread.content);
        }

        // Store the Quill instance for later use
        this.state.quillInstances.set(thread.id, quill);

        // Focus the editor
        quill.focus();

        // Handle keyboard shortcuts
        quill.keyboard.addBinding({
          key: 'Enter',
          shiftKey: false,
          handler: () => {
            this.saveThread(threadElement);
            return false;
          }
        });

        quill.keyboard.addBinding({
          key: 'Escape',
          handler: () => {
            this.cancelEditThread(threadElement);
            return false;
          }
        });
      }
    }
  }

  /**
   * Render a single audio clip item
   * @param {Object} audioClip - The audio clip data
   * @param {HTMLElement} threadsContainer - The container to append to
   */
  renderSingleAudioClip(audioClip, threadsContainer) {
    const formattedDate = this.formatDate(audioClip.createdAt);
    const isApproved = audioClip.isApproved === true;

    const audioElement = document.createElement('div');
    audioElement.className = `agenda-audio-clip agenda-thread-post mb-2 rounded-3 ${isApproved ? 'approved-audio' : ''}`;
    audioElement.dataset.audioId = audioClip.id;

    audioElement.innerHTML = `
            <div class="d-flex gap-3">
                <div class="flex-shrink-0">
                    <img src="${audioClip.userImage}" class="rounded-circle" width="40" height="40" alt="User">
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0 fw-semibold">
                            <i class="ti ti-microphone me-2 text-primary"></i>
                            ${audioClip.userName}
                        </h6>
                        <small class="text-muted" title="${new Date(audioClip.createdAt).toLocaleString()}">
                            ${formattedDate}
                        </small>
                    </div>
                    
                    <div class="audio-player-container mb-2">
                        <div class="d-flex align-items-center gap-3 p-3 rounded">
                            <button class="btn mb-1 btn-primary rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center audio-play-btn" data-audio-id="${audioClip.id}">
                                <i class="ti ti-player-play fs-6"></i>
                            </button>
                            <div class="flex-grow-1">
                                <div class="audio-waveform bg-white rounded" style="height: 30px; position: relative;">
                                    <div class="audio-progress bg-primary rounded" style="height: 100%; width: 0%; transition: width 0.1s;"></div>
                                    <div class="audio-time-display position-absolute top-50 start-50 translate-middle">
                                        <small class="text-muted">00:00</small>
                                    </div>
                                </div>
                                <audio src="${audioClip.audioUrl}" preload="metadata" style="display: none;"></audio>
                            </div>
                            <div class="audio-duration">
                                <small class="text-muted" id="duration-${audioClip.id}">--:--</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="audio-actions d-flex align-items-center">
                        <div class="d-flex align-items-center gap-2">
                            <a class="approve-audio p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${isApproved ? 'Approved' : 'Approve'}">
                                <i class="ti ${isApproved ? 'ti-star-filled text-warning' : 'ti-star text-muted'} fs-4"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-center gap-2 ms-4">
                            <a class="delete-audio p-0 hstack justify-content-center" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                <i class="ti ti-trash text-danger fs-4"></i>
                            </a>
                        </div>
                        <a class="connect-audio-action text-dark ms-auto d-flex align-items-center justify-content-center bg-transparent p-2 fs-4 rounded-circle" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Create an action">
                            <i class="ti ti-steam"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

    threadsContainer.appendChild(audioElement);

    // Initialize waveform audio player functionality
    this.initializeWaveformAudioPlayer(audioElement, audioClip);

    // Initialize tooltips
    const tooltipTriggerList = audioElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
  /**
   * Format a date string to a readable format
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) +
      ', ' + date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  }

  addNewAgendaPoint(customTitle = '', customDescription = '') {
    const {
      allAgendaPoints
    } = this.state.elements;
    if (!allAgendaPoints) return;

    // Create new agenda item data
    const itemCount = allAgendaPoints.children.length + 1;
    const agendaId = `agenda-${Date.now()}`;
    const defaultUrgency = this.state.urgencyLevels.find(level => level.id === this.state.defaultUrgency);

    // Create agenda item in state
    const newAgendaItem = {
      id: agendaId,
      title: customTitle || `Agenda Point ${itemCount}`,
      description: customDescription,
      urgency: this.state.defaultUrgency,
      createdAt: new Date().toISOString(),
      files: [],
      threads: []
    };

    // Save to state
    this.state.agendaItems.set(agendaId, newAgendaItem);

    // Create and append the DOM element
    const newAgendaPoint = document.createElement('div');
    newAgendaPoint.className = `p-4 rounded-4 ${defaultUrgency ? defaultUrgency.bgClass : 'bg-primary-super-subtle'} mb-4 position-relative agenda-item`;
    newAgendaPoint.dataset.agendaId = agendaId;
    newAgendaPoint.innerHTML = `
            <div class="agenda-head d-flex align-items-center gap-6 flex-wrap position-relative">
                <div class="d-flex align-items-center gap-1">
                    <div class="drag-handle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; border-radius: 4px;">
                        <i class="ti ti-grip-vertical text-muted fs-4"></i>
                    </div>
                    <h6 class="mb-0 fs-5 text-truncate meenoe-ed-number color-inherit">${itemCount}.</h6>
                    <!-- Hidden title for minimized view -->
                    <h6 class="mb-0 fs-5 text-truncate d-none minimized-title" style="cursor: text;">${newAgendaItem.title}</h6>
                </div>
                <span class="mb-1 badge rounded-pill ${defaultUrgency ? defaultUrgency.class.replace('text-', 'text-bg-') : 'text-bg-primary'} agenda-point-urgency">
                    ${defaultUrgency ? defaultUrgency.label : 'Important'}
                </span>
                <span class="fs-2 time-indicator">
                    <span class="p-1 text-bg-muted rounded-circle d-inline-block"></span> Just now
                </span>
                <div class="dropdown ms-auto">
                    <a href="#" class="text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ti ti-dots-vertical fs-4"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item d-flex align-items-center gap-2" href="#">
                            <i class="ti ti-lock fs-4"></i>
                            <span>Lock Agenda</span>
                        </a></li>
                        <li><a class="dropdown-item d-flex align-items-center gap-2 toggle-minimize" href="#">
                            <i class="ti ti-arrow-bar-to-up fs-4"></i>
                            <span class="minimize-text">Minimize</span>
                        </a></li>
                        <li><a class="dropdown-item d-flex align-items-center gap-2 move-up-action" href="#">
                            <i class="ti ti-arrow-up fs-4"></i>
                            <span>Move Up</span>
                        </a></li>
                        <li><a class="dropdown-item d-flex align-items-center gap-2 move-down-action" href="#">
                            <i class="ti ti-arrow-down fs-4"></i>
                            <span>Move Down</span>
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger d-flex align-items-center gap-2 delete-agenda-item" href="#">
                            <i class="ti ti-trash fs-4"></i>
                            <span>Delete Agenda</span>
                        </a></li>
                    </ul>
                </div>
            </div>
            </div>
            <div class="agenda-content">
                <h4 class="agenda-title fw-semibold text-dark mb-3 mt-3" style="cursor: text;">
                    ${newAgendaItem.title}
                </h4>
                <div class="agenda-description" contenteditable="false" style="min-height: 24px;">
                    ${newAgendaItem.description || 'Click to edit this agenda point description.'}
                </div>
                <div class="agenda-footer d-flex align-items-center mt-4">
                    <div class="d-flex align-items-center gap-2">
                        <i class="ti ti-paperclip"></i>
                        <span class="text-dark fw-semibold">0 files</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 ms-4">
                        <i class="ti ti-message"></i>
                        <span class="text-dark fw-semibold">0 threads</span>
                    </div>
                </div>
            </div>`;

    allAgendaPoints.appendChild(newAgendaPoint);

    // Update the sortable instance
    this.initializeSortable();

    // Select the new agenda point
    this.selectAgendaItem(newAgendaPoint);

    // Scroll to the new agenda point
    newAgendaPoint.scrollIntoView({
      behavior: 'smooth'
    });
  }

  /**
   * Renumber all agenda points in sequence
   */
  renumberAgendaPoints() {
    const allAgendaPoints = document.querySelectorAll('#all-agenda-points > .p-4.rounded-4');
    allAgendaPoints.forEach((point, index) => {
      const numberElement = point.querySelector('.meenoe-ed-number');
      if (numberElement) {
        numberElement.textContent = `${index + 1}.`;
      }
    });
  }

  /**
   * Move an agenda item up or down in the list
   * @param {HTMLElement} agendaItem - The agenda item element to move
   * @param {string} direction - 'up' or 'down' to specify the direction
   */
  moveAgendaItem(agendaItem, direction) {
    const allAgendaPoints = Array.from(document.querySelectorAll('#all-agenda-points > .p-4.rounded-4'));
    const currentIndex = allAgendaPoints.indexOf(agendaItem);

    if (direction === 'up' && currentIndex > 0) {
      // Move up
      const previousItem = allAgendaPoints[currentIndex - 1];
      agendaItem.parentNode.insertBefore(agendaItem, previousItem);
      this.syncAgendaItemsOrder();
    } else if (direction === 'down' && currentIndex < allAgendaPoints.length - 1) {
      // Move down
      const nextItem = allAgendaPoints[currentIndex + 1];
      agendaItem.parentNode.insertBefore(nextItem, agendaItem);
      this.syncAgendaItemsOrder();
    }

    // Update the numbering
    this.renumberAgendaPoints();
  }

  /**
   * Toggle minimize/maximize for an agenda item
   * @param {HTMLElement} agendaItem - The agenda item element to toggle
   */
  toggleAgendaItemMinimize(agendaItem) {
    const content = agendaItem.querySelector('.agenda-content');
    const minimizeBtn = agendaItem.querySelector('.toggle-minimize .minimize-text');
    const icon = agendaItem.querySelector('.toggle-minimize i');
    const urgencyBadge = agendaItem.querySelector('.agenda-point-urgency');
    const timeIndicator = agendaItem.querySelector('.time-indicator');
    const minimizedTitle = agendaItem.querySelector('.minimized-title');
    const agendaHead = agendaItem.querySelector('.agenda-head');

    if (agendaItem.classList.contains('minimized')) {
      // Restore
      content.style.display = 'block';
      content.style.height = 'auto';
      const height = content.offsetHeight + 'px';
      content.style.height = '0';

      // Show/hide elements for expanded view
      if (urgencyBadge) urgencyBadge.style.display = '';
      if (timeIndicator) timeIndicator.style.display = '';
      if (minimizedTitle) minimizedTitle.classList.add('d-none');
      if (agendaHead) agendaHead.classList.remove('minimized');

      // Trigger reflow
      void content.offsetHeight;

      // Animate to full height
      content.style.height = height;

      // Update button text and icon
      if (minimizeBtn) minimizeBtn.textContent = 'Minimize';
      if (icon) icon.className = 'ti ti-arrow-bar-to-up fs-4';

      // Remove minimized class after animation
      setTimeout(() => {
        content.style.overflow = 'hidden';
        content.style.height = '';
        content.style.overflow = '';
        agendaItem.classList.remove('minimized');
      }, 300);
    } else {
      // Minimize
      content.style.display = 'block';
      const height = content.offsetHeight + 'px';
      content.style.height = height;

      // Show/hide elements for minimized view
      if (urgencyBadge) urgencyBadge.style.display = 'none';
      if (timeIndicator) timeIndicator.style.display = 'none';
      if (minimizedTitle) minimizedTitle.classList.remove('d-none');
      if (agendaHead) agendaHead.classList.add('minimized');

      // Trigger reflow
      void content.offsetHeight;

      // Animate to 0 height
      content.style.height = '0';
      content.style.overflow = 'hidden';

      // Update button text and icon
      if (minimizeBtn) minimizeBtn.textContent = 'Maximize';
      if (icon) icon.className = 'ti ti-arrow-bar-to-down fs-4';

      // Add minimized class after animation
      setTimeout(() => {
        agendaItem.classList.add('minimized');
        content.style.display = 'none';
        content.style.height = '';
        content.style.overflow = '';
      }, 300);
    }
  }

  /**
   * Get the appropriate icon for a file based on its type
   * @param {Object} file - The file object
   * @returns {string} HTML string for the file icon
   */
  getFileIcon(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const type = file.type ? file.type.split('/')[0] : '';

    const iconMap = {
      // Document icons
      'pdf': 'ti-file-text',
      'doc': 'ti-file-word',
      'docx': 'ti-file-word',
      'txt': 'ti-file-text',
      'rtf': 'ti-file-text',
      'md': 'ti-markdown',

      // Spreadsheet icons
      'xls': 'ti-file-spreadsheet',
      'xlsx': 'ti-file-spreadsheet',
      'csv': 'ti-file-spreadsheet',

      // Presentation icons
      'ppt': 'ti-presentation',
      'pptx': 'ti-presentation',

      // Image icons
      'jpg': 'ti-photo',
      'jpeg': 'ti-photo',
      'png': 'ti-photo',
      'gif': 'ti-photo',
      'svg': 'ti-photo',
      'webp': 'ti-photo',

      // Video icons
      'mp4': 'ti-video',
      'webm': 'ti-video',
      'mov': 'ti-video',
      'avi': 'ti-video',

      // Audio icons
      'mp3': 'ti-music',
      'wav': 'ti-music',
      'ogg': 'ti-music',

      // Archive icons
      'zip': 'ti-file-zip',
      'rar': 'ti-file-zip',
      '7z': 'ti-file-zip',
      'tar': 'ti-file-zip',
      'gz': 'ti-file-zip',
    };

    // Check for specific file types first
    if (iconMap[extension]) {
      return `<i class="ti ${iconMap[extension]} me-2"></i>`;
    }

    // Fall back to MIME type
    switch (type) {
      case 'image':
        return '<i class="ti ti-photo me-2"></i>';
      case 'video':
        return '<i class="ti ti-video me-2"></i>';
      case 'audio':
        return '<i class="ti ti-music me-2"></i>';
      case 'application':
        if (file.type.includes('pdf')) return '<i class="ti ti-file-text me-2"></i>';
        if (file.type.includes('word')) return '<i class="ti ti-file-word me-2"></i>';
        if (file.type.includes('excel') || file.type.includes('spreadsheet'))
          return '<i class="ti ti-file-spreadsheet me-2"></i>';
        if (file.type.includes('powerpoint') || file.type.includes('presentation'))
          return '<i class="ti ti-presentation me-2"></i>';
        if (file.type.includes('zip') || file.type.includes('compressed'))
          return '<i class="ti ti-file-zip me-2"></i>';
        return '<i class="ti ti-file me-2"></i>';
      default:
        return '<i class="ti ti-file me-2"></i>';
    }
  }

  /**
   * Format file size to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Show a dropdown of files that can be referenced
   * @param {Quill} quill - The Quill editor instance
   * @param {Object} range - The current cursor position/selection range
   * @param {Array} files - Array of file objects to display in the dropdown
   */
  showFileDropdown(quill, range, files) {
    // Store reference to AgendaFlow instance for use in event handlers
    const agendaFlow = this;

    // Remove any existing dropdown
    this.removeFileDropdown();

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'file-reference-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '9999';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #dee2e6';
    dropdown.style.borderRadius = '0.375rem';
    dropdown.style.boxShadow = 'rgba(0, 0, 0, 0.05) 0px 10px 15px -3px, rgba(0, 0, 0, 0.025) 0px 4px 6px -2px';
    dropdown.style.maxHeight = '400px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.width = '350px';
    dropdown.setAttribute('role', 'menu');
    dropdown.setAttribute('aria-label', 'File references');

    // Add search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'p-2 border-bottom';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control form-control-sm';
    searchInput.placeholder = 'Search files...';
    searchInput.setAttribute('aria-label', 'Search files');
    searchInput.style.borderRadius = '0.25rem';
    searchInput.style.padding = '0.375rem 0.75rem';
    searchInput.style.fontSize = '0.875rem';

    searchContainer.appendChild(searchInput);
    dropdown.appendChild(searchContainer);

    // Add files list container
    const filesList = document.createElement('div');
    filesList.className = 'list-group list-group-flush';
    filesList.style.maxHeight = '350px';
    filesList.style.overflowY = 'auto';

    // Add files to the list
    const renderFiles = (filter = '') => {
      filesList.innerHTML = '';
      const searchTerm = filter.toLowerCase().trim();
      const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm) ||
        (file.type && file.type.toLowerCase().includes(searchTerm))
      );

      if (filteredFiles.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'p-3 text-muted text-center';
        noResults.textContent = 'No matching files found';
        noResults.style.fontSize = '0.875rem';
        filesList.appendChild(noResults);
        return;
      }

      // Add section header
      const header = document.createElement('div');
      header.className = 'px-3 py-2 small text-muted bg-light border-bottom';
      header.textContent = `Found ${filteredFiles.length} file${filteredFiles.length !== 1 ? 's' : ''}${searchTerm ? ` matching "${searchTerm}"` : ''}`;
      filesList.appendChild(header);

      filteredFiles.forEach((file, index) => {
        const fileItem = document.createElement('button');
        fileItem.className = 'list-group-item list-group-item-action border-0 d-flex align-items-center';
        fileItem.style.cursor = 'pointer';
        fileItem.style.padding = '0.5rem 1rem';
        fileItem.style.fontSize = '0.875rem';
        fileItem.style.transition = 'background-color 0.15s ease';
        fileItem.setAttribute('role', 'menuitem');
        fileItem.setAttribute('tabindex', '0');
        fileItem.setAttribute('data-file-index', index);

        // Add hover effect
        fileItem.addEventListener('mouseenter', () => {
          fileItem.style.backgroundColor = '#f8f9fa';
        });
        fileItem.addEventListener('mouseleave', () => {
          fileItem.style.backgroundColor = '';
        });

        // File icon
        const icon = document.createElement('span');
        icon.className = 'me-2 d-flex align-items-center';
        icon.style.color = '#6c757d';
        icon.style.fontSize = '1.25rem';
        icon.style.width = '1.5rem';
        icon.style.justifyContent = 'center';
        icon.innerHTML = this.getFileIcon(file);

        // File info container
        const fileInfo = document.createElement('div');
        fileInfo.className = 'd-flex flex-column';
        fileInfo.style.overflow = 'hidden';

        // File name
        const fileName = document.createElement('div');
        fileName.className = 'text-truncate';
        fileName.style.maxWidth = '250px';
        fileName.textContent = file.name;

        // File meta (size and type)
        const fileMeta = document.createElement('div');
        fileMeta.className = 'small text-muted d-flex';
        fileMeta.style.fontSize = '0.75rem';
        fileMeta.style.gap = '0.75rem';

        const fileSize = document.createElement('span');
        fileSize.textContent = this.formatFileSize(file.size || 0);

        const fileType = document.createElement('span');
        fileType.textContent = file.type || 'Unknown type';

        fileMeta.appendChild(fileSize);
        fileMeta.appendChild(fileType);

        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileMeta);

        fileItem.appendChild(icon);
        fileItem.appendChild(fileInfo);

        // Handle file selection
        fileItem.addEventListener('click', (e) => {
          // Get file icon and color based on file type
          const iconClass = agendaFlow.getFileTypeIcon(file.name);

          // Create clickable file reference HTML with appropriate icon
          const fileReference = `<a href="#" class="file-reference text-decoration-none" data-file-name="${file.name}" data-file-size="${file.size}" data-file-type="${file.type}"><i class="${iconClass} me-1"></i> ${file.name}</a>`;

          // Try to find the active Quill instance
          let activeQuill = null;

          // Check if the passed quill object has the methods we need
          if (quill && typeof quill.insertText === 'function') {
            activeQuill = quill;
          } else {
            // Try to find an active Quill instance from our stored instances
            for (const [id, quillInstance] of agendaFlow.state.quillInstances) {
              if (quillInstance && typeof quillInstance.insertText === 'function') {
                // Check if this quill instance has focus or is in an active thread
                const quillContainer = quillInstance.container;
                if (quillContainer && (quillContainer.classList.contains('ql-focus') ||
                    document.activeElement === quillContainer ||
                    quillContainer.contains(document.activeElement))) {
                  activeQuill = quillInstance;
                  break;
                }
              }
            }

            // If still no active quill, use the first available one
            if (!activeQuill) {
              for (const [id, quillInstance] of agendaFlow.state.quillInstances) {
                if (quillInstance && typeof quillInstance.insertText === 'function') {
                  activeQuill = quillInstance;
                  break;
                }
              }
            }
          }

          if (activeQuill) {
            // Insert the file reference HTML at the current position
            if (range && typeof range.index === 'number') {
              // Use clipboard to insert HTML content
              activeQuill.clipboard.dangerouslyPasteHTML(range.index, fileReference + ' ');
              // Move cursor after the inserted content
              activeQuill.setSelection(range.index + fileReference.length + 1, 0, 'user');
            } else {
              // Fallback: insert at the end
              const length = activeQuill.getLength();
              activeQuill.clipboard.dangerouslyPasteHTML(length - 1, fileReference + ' ');
              activeQuill.setSelection(length + fileReference.length, 0, 'user');
            }

            // Focus back to the editor
            activeQuill.focus();
          } else {
            console.warn('No active Quill instance found for file insertion');
          }

          // Remove the dropdown
          agendaFlow.removeFileDropdown();
        });

        // Handle keyboard navigation
        fileItem.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileItem.click();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextItem = filesList.querySelector(`[data-file-index="${index + 1}"]`);
            if (nextItem) nextItem.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
              const prevItem = filesList.querySelector(`[data-file-index="${index - 1}"]`);
              if (prevItem) prevItem.focus();
            } else {
              searchInput.focus();
            }
          }
        });

        filesList.appendChild(fileItem);
      });

      // Focus first item after filtering
      const firstItem = filesList.querySelector('[data-file-index="0"]');
      if (firstItem) firstItem.focus();
    };

    // Initial render
    renderFiles();
    dropdown.appendChild(filesList);

    // Add search functionality
    searchInput.addEventListener('input', (e) => {
      renderFiles(e.target.value);
    });

    // Add to document
    document.body.appendChild(dropdown);

    // Position the dropdown below the Quill editor
    try {
      let editorPosition = {
        top: 205,
        left: 540
      };

      // Position relative to the actual Quill editing area, not the entire container
      if (quill && quill.root) {
        // Use quill.root which is the actual editable area
        const editorRect = quill.root.getBoundingClientRect();

        // Position dropdown below the actual text editing area
        editorPosition.top = editorRect.bottom + window.scrollY + 5;
        editorPosition.left = editorRect.left + window.scrollX;
      } else if (quill && quill.container) {
        // Fallback: try to find the .ql-editor element within the container
        const qlEditor = quill.container.querySelector('.ql-editor');
        if (qlEditor) {
          const editorRect = qlEditor.getBoundingClientRect();
          editorPosition.top = editorRect.bottom + window.scrollY + 5;
          editorPosition.left = editorRect.left + window.scrollX;
        } else {
          // Last fallback: use container
          const editorRect = quill.container.getBoundingClientRect();
          editorPosition.top = editorRect.bottom + window.scrollY + 5;
          editorPosition.left = editorRect.left + window.scrollX;
        }
      } else {

      }

      // Position dropdown at calculated position
      dropdown.style.top = `${editorPosition.top}px`;
      dropdown.style.left = `${editorPosition.left}px`;

      // Ensure dropdown doesn't go off-screen
      setTimeout(() => {
        const dropdownRect = dropdown.getBoundingClientRect();
        if (dropdownRect.right > window.innerWidth) {
          dropdown.style.left = `${window.innerWidth - dropdownRect.width - 10}px`;
        }
        if (dropdownRect.bottom > window.innerHeight) {
          // Position above editor instead
          dropdown.style.top = `${editorPosition.top - dropdownRect.height - 10}px`;
        }
      }, 0);
    } catch (error) {
      console.warn('Could not position file dropdown precisely, using fallback position:', error);
      // Fallback positioning
      dropdown.style.top = '150px';
      dropdown.style.left = '100px';
    }

    // Focus the search input
    searchInput.focus();

    // Store reference for cleanup
    this.currentFileDropdown = {
      element: dropdown,
      quill
    };

    // Close on click outside
    this.handleClickOutside = (e) => {
      if (!dropdown.contains(e.target) && e.target !== quill.root) {
        this.removeFileDropdown();
      }
    };

    document.addEventListener('mousedown', this.handleClickOutside);

    // Handle keyboard navigation
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.removeFileDropdown();
        quill.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = filesList.querySelectorAll('button');
        const currentIndex = Array.from(items).indexOf(document.activeElement);

        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
          items[Math.max(0, currentIndex + 1)].focus();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          items[currentIndex - 1].focus();
        } else if (currentIndex === -1 && items.length > 0) {
          items[0].focus();
        }
      } else if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
        // If pressing enter in search, focus first item
        const firstItem = filesList.querySelector('button');
        if (firstItem) firstItem.focus();
      }
    });
  }

  /**
   * Remove the file reference dropdown if it exists
   */
  removeFileDropdown() {
    if (this.currentFileDropdown) {
      document.body.removeChild(this.currentFileDropdown.element);
      document.removeEventListener('mousedown', this.handleClickOutside);
      this.currentFileDropdown = null;
    }
  }

  /**
   * Initialize Sortable for drag and drop reordering
   */
  initializeSortable() {
    const allAgendaPoints = document.getElementById('all-agenda-points');
    if (!allAgendaPoints) return;

    // Destroy any existing Sortable instance
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
    }

    // Initialize new Sortable instance
    this.sortableInstance = new Sortable(allAgendaPoints, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: () => this.renumberAgendaPoints(),
      onStart: () => {
        document.body.classList.add('dragging-agenda-item');
      },
      onEnd: () => {
        document.body.classList.remove('dragging-agenda-item');
        this.renumberAgendaPoints();
      }
    });
  }

  /**
   * Sync the internal agenda items array with the current DOM order
   */
  syncAgendaItemsOrder() {
    const {
      allAgendaPoints
    } = this.state.elements;
    if (!allAgendaPoints) return;

    const points = allAgendaPoints.querySelectorAll('.p-4.rounded-4');
    const newOrder = new Map();

    points.forEach(point => {
      const pointId = point.dataset.agendaId;
      if (this.state.agendaItems.has(pointId)) {
        newOrder.set(pointId, this.state.agendaItems.get(pointId));
      }
    });

    // Update the state with the new order
    this.state.agendaItems = newOrder;

    // Sync order with meenoeState
    if (window.meenoeState && typeof window.meenoeState.updateAgendaOrderFromAgendaFlow === 'function') {
      window.meenoeState.updateAgendaOrderFromAgendaFlow();
    }
  }

  /**
   * Set the current agenda item
   * @param {number} index - Index of the item to set as current
   */
  /**
   * Filter agenda points based on search query
   * @param {string} query - The search query
   */
  filterAgendaPoints(query) {
    const searchQuery = query.toLowerCase().trim();
    const agendaPoints = document.querySelectorAll('.agenda-point-card');

    agendaPoints.forEach(point => {
      const title = point.querySelector('.agenda-point-title')?.textContent?.toLowerCase() || '';
      if (title.includes(searchQuery) || !searchQuery) {
        point.style.display = '';
      } else {
        point.style.display = 'none';
      }
    });
  }

  /**
   * Set the current agenda item
   * @param {number} index - Index of the item to set as current
   */
  setCurrentItem(index) {
    if (index >= -1 && index < this.agendaItems.length) {
      this.currentItemIndex = index;
      this.renderAgenda();
    }
  }

  /**
   * Highlight an agenda item temporarily (e.g., when navigated from a linked action)
   * @param {string} agendaId - The ID of the agenda item to highlight
   */
  highlightAgendaItem(agendaId) {
    const agendaElement = document.querySelector(`[data-agenda-id="${agendaId}"]`);
    if (agendaElement) {
      // Add highlight class
      agendaElement.classList.add('agenda-item-highlight');

      // Remove highlight after a few seconds
      setTimeout(() => {
        agendaElement.classList.remove('agenda-item-highlight');
      }, 3000);
    }
  }

  /**
   * Handle clicks on file references in threads
   * @param {string} fileName - Name of the file
   * @param {string} fileSize - Size of the file
   * @param {string} fileType - MIME type of the file
   */
  handleFileReferenceClick(fileName, fileSize, fileType) {
    // Get the current agenda item to find the actual file object
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.files) {
      this.showToast('File not found in current agenda item', 'warning');
      return;
    }

    // Find the file in the current agenda item
    const file = agendaItem.files.find(f => f.name === fileName);
    if (!file) {
      this.showToast('File not found in attachments', 'warning');
      return;
    }

    // Create a modal to show file options
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'fileReferenceModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'fileReferenceModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="fileReferenceModalLabel">
                            <i class="ti ti-file me-2"></i>
                            ${fileName}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="file-icon">
                                <i class="${this.getFileTypeIcon(fileName)} fs-1"></i>
                            </div>
                            <div class="file-details">
                                <h6 class="mb-1">${fileName}</h6>
                                <p class="text-muted mb-0">
                                    Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB<br>
                                    Type: ${fileType || 'Unknown'}
                                </p>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="ti ti-info-circle me-2"></i>
                            This file is referenced in this thread. You can view the file details or download it if needed.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="downloadFileBtn">
                            <i class="ti ti-download me-2"></i>Download
                        </button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle download button click
    const downloadBtn = modal.querySelector('#downloadFileBtn');
    downloadBtn.addEventListener('click', () => {
      this.downloadFile(fileName, file);
      bsModal.hide();
    });

    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modal);
    });
  }

  /**
   * Download or simulate download of a file
   * @param {string} fileName - Name of the file
   * @param {Object} fileData - File data object
   */
  downloadFile(fileName, fileData) {
    // If we have the actual File object, trigger a real download
    if (fileData.fileObject instanceof File) {
      const url = URL.createObjectURL(fileData.fileObject);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.showToast(`Downloading: ${fileName}`, 'success');
    } else {
      // Fallback: show info toast
      this.showToast(`File reference: ${fileName} (${(fileData.size / 1024 / 1024).toFixed(2)} MB)`, 'info');
    }
  }

  /**
   * Toggle audio clip approval status
   * @param {HTMLElement} audioElement - The audio clip element to toggle approval for
   */
  toggleAudioApproval(audioElement) {
    const audioId = audioElement.dataset.audioId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.audioClips) return;

    const audioClip = agendaItem.audioClips.find(clip => clip.id === audioId);
    if (!audioClip) return;

    // Toggle approved status
    audioClip.isApproved = !audioClip.isApproved;

    // Update the UI to reflect the change
    const starIcon = audioElement.querySelector('.approve-audio i');
    const approveLink = audioElement.querySelector('.approve-audio');

    if (starIcon && approveLink) {
      if (audioClip.isApproved) {
        starIcon.className = 'ti ti-star-filled text-warning fs-4';
        audioElement.classList.add('approved-audio');

        // Update tooltip
        const tooltip = bootstrap.Tooltip.getInstance(approveLink);
        if (tooltip) {
          tooltip.setContent({
            '.tooltip-inner': 'Approved'
          });
        } else {
          approveLink.setAttribute('data-bs-title', 'Approved');
        }

        this.showToast('Audio clip approved', 'success');
      } else {
        starIcon.className = 'ti ti-star text-muted fs-4';
        audioElement.classList.remove('approved-audio');

        // Update tooltip
        const tooltip = bootstrap.Tooltip.getInstance(approveLink);
        if (tooltip) {
          tooltip.setContent({
            '.tooltip-inner': 'Approve'
          });
        } else {
          approveLink.setAttribute('data-bs-title', 'Approve');
        }

        this.showToast('Audio clip approval removed', 'info');
      }
    }

    // Update the agenda item in state
    this.state.agendaItems.set(agendaId, agendaItem);
  }

  /**
   * Remove an audio clip from the current agenda item
   * @param {HTMLElement} audioElement - The audio clip element to remove
   */
  removeAudioClip(audioElement) {
    if (!confirm('Are you sure you want to delete this audio clip?')) {
      return;
    }

    const audioId = audioElement.dataset.audioId;
    const agendaId = this.state.currentAgendaId;
    const agendaItem = this.state.agendaItems.get(agendaId);

    if (!agendaItem || !agendaItem.audioClips) return;

    // Find and remove the audio clip
    const audioIndex = agendaItem.audioClips.findIndex(clip => clip.id === audioId);
    if (audioIndex === -1) return;

    const removedClip = agendaItem.audioClips[audioIndex];

    // Clean up the audio URL
    if (removedClip.audioUrl) {
      URL.revokeObjectURL(removedClip.audioUrl);
    }

    // Remove the audio clip from the array
    agendaItem.audioClips.splice(audioIndex, 1);
    this.state.agendaItems.set(agendaId, agendaItem);

    // Remove the element from the DOM
    audioElement.remove();

    // Update audio clip count
    this.updateAudioClipCount(agendaItem);

    // Show success message
    this.showToast('Audio clip deleted successfully', 'success');

    // If no audio clips remain, hide the audio section
    if (agendaItem.audioClips.length === 0) {
      const audioSection = document.querySelector('.agenda-audio-section');
      if (audioSection) {
        audioSection.remove();
      }
    }
  }

  /**
   * Create a new action from an audio clip
   * @param {HTMLElement} audioElement - The audio clip element to create an action from
   */
  connectActionToAudio(audioElement) {
    try {
      const audioId = audioElement.dataset.audioId;
      const agendaId = this.state.currentAgendaId;

      if (!agendaId) {
        console.error('No agenda item is currently selected');
        return;
      }

      // Get the agenda item data from state
      const agendaItem = this.state.agendaItems.get(agendaId);
      if (!agendaItem) {
        console.error('Could not find agenda item data for ID:', agendaId);
        return;
      }

      // Find the audio clip
      const audioClip = agendaItem.audioClips?.find(clip => clip.id === audioId);
      if (!audioClip) {
        console.error('Could not find audio clip');
        return;
      }

      // Find the audio clip index for naming
      const audioIndex = agendaItem.audioClips.findIndex(clip => clip.id === audioId);
      const audioNumber = audioIndex + 1;

      // Create a title that combines the agenda point name and audio clip number
      const actionTitle = `${agendaItem.title.trim()} - Audio Clip ${audioNumber}`;

      // Create a new action using the tree object from meenoeInit.js
      if (typeof tree !== 'undefined' && tree) {
        // Check if we need to switch to default layout
        const layoutContainer = document.querySelector('.layout-container');
        const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');

        // If not in default layout, switch to it
        if (!isDefaultLayout) {
          // Find and click the default layout button
          const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
          if (defaultLayoutBtn) {
            defaultLayoutBtn.click();
          }
        }

        // Switch to the actions tab
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
          const tab = new bootstrap.Tab(actionsTab);
          tab.show();
        }

        // Create the action with the combined title
        const newAction = tree.createNode(
          actionTitle, // Action title
          false, // isRoot
          null, // parent
          null, // data
          null, // callback
          'context1' // context
        );

        // Scroll to the newly created action after a short delay to allow DOM updates
        setTimeout(() => {
          if (newAction && newAction.elementLi) {
            newAction.elementLi.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            // Add a highlight effect
            newAction.elementLi.classList.add('highlight-action');
            setTimeout(() => {
              newAction.elementLi.classList.remove('highlight-action');
            }, 2000);
          }
        }, 300);

        // Link the action to the agenda point (optional)
        if (newAction) {
          newAction.linkedAgenda = [agendaId];

          // Show success message
          this.showToast(`Created new action: ${actionTitle}`, 'success');

          // Redraw the tree to show the new action
          tree.drawTree();
        }
      } else {
        console.error('Tree object is not available');
        this.showToast('Failed to create action: Action system not available', 'error');
      }
    } catch (error) {
      console.error('Error creating action from audio clip:', error);
      this.showToast('Failed to create action', 'error');
    }
  }
}

// Initialize AgendaFlow immediately for dynamic content support
// This will work with both static and dynamically loaded HTML
if (!window.agendaFlow) {
  window.agendaFlow = new AgendaFlow();
}

// Cleanup function for when the page is unloaded or content is replaced
window.agendaFlowCleanup = function() {
  if (window.agendaFlow && window.agendaFlow.state.mutationObserver) {
    window.agendaFlow.state.mutationObserver.disconnect();
  }
};

// Auto-cleanup on page unload
window.addEventListener('beforeunload', window.agendaFlowCleanup);
