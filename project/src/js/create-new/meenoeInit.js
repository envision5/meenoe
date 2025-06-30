/**
 * Build or update the DOM for a meenoe-action-card given a node.
 * Ensures all inner sections (action-selector, meenoe-action-trigger, icons, etc.) are initialized.
 * Call this after creating an action node programmatically (e.g., via AI).
 */
window.buildActionCardUI = function(node) {
  // Find the action card DOM element by node id
  const card = document.getElementById(node.id);
  if (!card || !card.classList.contains('meenoe-action-card')) return;

  // Example: ensure action-selector exists and is initialized
  let actionSelector = card.querySelector('.action-selector');
  if (!actionSelector) {
    actionSelector = document.createElement('div');
    actionSelector.className = 'action-selector';
    card.prepend(actionSelector);
  }
  // Optionally, set default content or icon if missing
  if (!actionSelector.innerHTML.trim()) {
    actionSelector.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="meenoe-action-info-icon p-6 bg-warning-super-subtle rounded d-flex align-items-center justify-content-center">
          <i class="ti ti-grid-dots text-warning fw-semibold fs-7"></i>
        </div>
        <div>
          <h6 class="meenoe_action_type fs-4 fw-semibold">${node.actionType || 'Action'}</h6>
          <div class="meenoe-action-date fs-2 text-muted">${node.actionDate || ''}</div>
        </div>
        <button type="button" class="btn p-2 bg-warning-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-info ms-auto">
          <i class="fs-3 ti ti-pencil text-warning"></i>
        </button>
      </div>
      <h6 class="meenoe_action_description text-muted fw-normal mt-2">${node.actionDescription || ''}</h6>
    `;
  }

  // Ensure meenoe-action-trigger exists and is initialized
  let triggerDiv = card.querySelector('.meenoe-action-trigger');
  if (!triggerDiv) {
    triggerDiv = document.createElement('div');
    triggerDiv.className = 'meenoe-action-trigger';
    card.appendChild(triggerDiv);
  }
  // Optionally, set default trigger content
  if (!triggerDiv.innerHTML.trim()) {
    triggerDiv.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-1">
        <div class="d-flex">
          <div class="btn bg-warning-super-subtle text-warning meenoe-trigger-details">
            <i class="ti ti-pin-invoke me-2"></i>
            No trigger set
          </div>
        </div>
        <button type="button" class="btn p-2 bg-warning-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
          <i class="fs-3 ti ti-pencil text-warning"></i>
        </button>
      </div>
    `;
  }

  // Optionally, initialize other mappings (icons, descriptions, etc.) as needed
  // More logic can be added here to match the full UI as in manual creation
};



/**
 * Render the trigger UI for a meenoe-action-card given a node's actionTrigger.
 * Used by both UI and agentic/AI function calls to ensure the DOM matches the trigger data.
 */
window.renderActionTriggerUI = function(node) {
    const card = document.getElementById(node.id);
    if (!card) return;
    const triggerDiv = card.querySelector('.meenoe-action-trigger');
    if (!triggerDiv) return;

    let trigger = node.actionTrigger || {};
    let actionStatus = node.actionStatus || 'open';
    let actionStatusClass = 'warning';
    if (actionStatus === 'open') actionStatusClass = 'warning';
    else if (actionStatus === 'pending') actionStatusClass = 'primary';
    else if (actionStatus === 'complete') actionStatusClass = 'success';
    else if (actionStatus === 'queued') actionStatusClass = 'dark';

    // Render based on triggerType
    if (!trigger.triggerType || trigger.triggerType === 'fluid') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-ripple me-2"></i>
                        This action is always open, and never closes.
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'deadline') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-clock-hour-9 me-2"></i>
                        The deadline for this action is ${trigger.triggerDate || ''}
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'due date') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-clock-hour-7 me-2"></i>
                        This action is due on or before ${trigger.triggerDate || ''}
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'available until') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-clock-hour-7 me-2"></i>
                        This action will be available until ${trigger.triggerDate || ''}
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'conditional') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-progress-check me-2"></i>
                        This action will be considered complete once the progress surpasses or is at <strong>${trigger.conditionPercent || ''}</strong>%
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'approval') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-file-like me-2"></i>
                        This action is pending approval and has not yet been approved.
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else if (trigger.triggerType === 'recurring') {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-calendar me-2"></i>
                        This is a recurring action which happens once ${trigger.frequency || ''}. The next occurrence is scheduled for ${trigger.triggerDate || ''}
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>
        `;
    } else {
        triggerDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-warning-super-subtle text-warning meenoe-trigger-details">
                        <i class="ti ti-pin-invoke me-2"></i>
                        No trigger set
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-warning-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                    <i class="fs-3 ti ti-pencil text-warning"></i>
                </button>
            </div>
        `;
    }
};

// Helper function to get urgency class
function getUrgencyClass(urgencyLevel) {
  const urgencyClasses = {
    'normal': 'bg-dark-subtle text-muted',
    'moderate': 'bg-secondary-subtle text-secondary',
    'important': 'bg-primary-subtle text-primary',
    'critical': 'bg-warning-subtle text-warning',
    'mandatory': 'bg-danger-subtle text-danger'
  };
  return urgencyClasses[urgencyLevel] || urgencyClasses['normal'];
}

// Utility function to remove zero-actions placeholder if it exists
function removeZeroActionsPlaceholder() {
  const zeroActionsElement = document.getElementById('zero-actions');
  if (zeroActionsElement) {
    zeroActionsElement.remove();
    return true;
  }
  return false;
}

window.initMeenoeTree = function() {
  // Generate a unique ID function (example implementation)
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Only initialize tree and related logic if the container exists
  var divTree = document.getElementById('div_tree');
  if (divTree) {
    //Creating the tree
    window.tree = createTree('div_tree', 'white');

    //Loop to create test nodes
    for (var i = 1; i < 2; i++) {
      //node1 = tree.createNode('Action ' + i, false, null, null, null, 'context1');
    }

    //Rendering the tree
    if (typeof window.tree !== 'undefined' && window.tree) {
      window.tree.drawTree();
    }
  }
};

function expand_all() {
  tree.expandTree();
}

function collapse_all() {
  tree.collapseTree();
}

function SerializeTree() {
  var Stree = tree.serializeActions(tree);
}

// Add a double click event listener
document.addEventListener('dblclick', function(e) {
  if (e.target.matches('a[data-action="showLinkedAgenda"]')) {
    e.preventDefault();
    let actioncard = e.target.closest(".meenoe-action-card");
    e.target.setAttribute('data-action', 'link-agenda');
    e.target.setAttribute('data-linked-agenda', selectedAdCard);
    let node = tree.findNodeByID(actioncard.id);
    node.linkedAgenda = [];
    e.target.classList.remove("pulse");
    e.target.innerHTML = `
			  <i class="ti ti-route text-primary fs-4"></i>
			  <span class="d-none d-md-block font-weight-medium fs-3">Linked Agenda</span>
			`;
  }
});

// Collapsable cards
document.addEventListener("click", function(e) {
  if (e.target.matches('a[data-action="link-agenda"]')) {
    e.preventDefault();
    let actioncard = e.target.closest(".meenoe-action-card");
    let LinkeAgendaNotice = actioncard.querySelector('.linked-agenda-notice');
    
    // Get the modal body element
    let modalBody = document.getElementById('linked-agenda-modalBody');
    let linkagendalist = modalBody.querySelector('#linked-agenda-list');
    let noAgendaMessage = modalBody.querySelector('#noAgendaMessage');
    let setButton = document.getElementById('setButton');

    // Clear the modal body
    linkagendalist.innerHTML = '';
    setButton.disabled = true;

    // Remove any existing event listeners and clone the button first
    const clonedSetButton = setButton.cloneNode(true);
    setButton.parentNode.replaceChild(clonedSetButton, setButton);
    
    // Update reference to the new button
    setButton = clonedSetButton;

    // Get agenda points from AgendaFlow
    let agendaPoints = [];
    if (window.agendaFlow && window.agendaFlow.state.agendaItems) {
      agendaPoints = Array.from(window.agendaFlow.state.agendaItems.values());
    }

    // Show/hide no agenda message
    if (agendaPoints.length === 0) {
      noAgendaMessage.classList.remove('d-none');
      linkagendalist.classList.add('d-none');
    } else {
      noAgendaMessage.classList.add('d-none');
      linkagendalist.classList.remove('d-none');

      // Populate agenda points
      agendaPoints.forEach((agendaItem, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item list-group-item-action";
        listItem.setAttribute('data-agenda-id', agendaItem.id);

        const listItemDiv = document.createElement("div");
        listItemDiv.className = "form-check d-flex align-items-start gap-3 p-2";

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.classList.add("form-check-input", "mt-1");
        radio.name = 'agendaSelection';
        radio.value = agendaItem.id;
        radio.id = `agenda-${agendaItem.id}`;

        const labelWrapper = document.createElement('div');
        labelWrapper.className = "flex-grow-1";

        const label = document.createElement('label');
        label.className = "form-check-label fw-medium";
        label.setAttribute('for', `agenda-${agendaItem.id}`);
        label.style.cursor = 'pointer';

        const agendaNumber = document.createElement('span');
        agendaNumber.className = "badge bg-primary-subtle text-primary me-2";
        agendaNumber.textContent = `#${index + 1}`;

        const agendaTitle = document.createElement('span');
        agendaTitle.textContent = agendaItem.title || 'Untitled Agenda Point';

        label.appendChild(agendaNumber);
        label.appendChild(agendaTitle);

        // Add description if available
        if (agendaItem.description && agendaItem.description.trim()) {
          const description = document.createElement('div');
          description.className = "small text-muted mt-1";
          description.textContent = agendaItem.description.substring(0, 100) + (agendaItem.description.length > 100 ? '...' : '');
          labelWrapper.appendChild(label);
          labelWrapper.appendChild(description);
        } else {
          labelWrapper.appendChild(label);
        }

        // Add urgency indicator
        const urgencyLevel = agendaItem.urgency || 'normal';
        const urgencyIndicator = document.createElement('span');
        urgencyIndicator.className = `badge ms-2 ${getUrgencyClass(urgencyLevel)}`;
        urgencyIndicator.textContent = urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1);
        label.appendChild(urgencyIndicator);

        listItemDiv.appendChild(radio);
        listItemDiv.appendChild(labelWrapper);
        listItem.appendChild(listItemDiv);

        // Add click handler for the entire item
        listItem.addEventListener('click', function(e) {
          if (e.target.type !== 'radio') {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
          }
        });

        // Add change handler for radio button
        radio.addEventListener('change', function() {
          setButton.disabled = false;
          
          // Remove active class from all items
          linkagendalist.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
          });
          // Add active class to selected item
          if (this.checked) {
            listItem.classList.add('active');
          }
        });

        linkagendalist.appendChild(listItem);
      });
    }

    // Setup search functionality
    const searchInput = modalBody.querySelector('#agendaSearchInput');
    searchInput.value = '';
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const agendaItems = linkagendalist.querySelectorAll('.list-group-item');
      
      agendaItems.forEach(item => {
        const label = item.querySelector('.form-check-label');
        const text = label.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });

    // Add event listener to the set button
    setButton.addEventListener('click', function() {
      const selected = document.querySelector('input[name="agendaSelection"]:checked');
      if (!selected) {
        alert('Please select an agenda point to link.');
        return;
      }

      const selectedAgendaId = selected.value;
      const selectedAgendaItem = agendaPoints.find(item => item.id === selectedAgendaId);
      const selectedIndex = agendaPoints.findIndex(item => item.id === selectedAgendaId) + 1;
      
      if (!selectedAgendaItem) {
        alert('Selected agenda point not found.');
        return;
      }
      
      // Get the action status and determine styling
      let actionNode = tree.findNodeByID(actioncard.id);
      let actionStatus = actionNode ? actionNode.actionStatus : 'open';
      let actionStatusClass = 'warning';
      
      if (actionStatus === 'open') {
        actionStatusClass = 'warning';
      } else if (actionStatus === 'pending') {
        actionStatusClass = 'primary';
      } else if (actionStatus === 'complete') {
        actionStatusClass = 'success';
      } else if (actionStatus === 'queued') {
        actionStatusClass = 'dark';
      }
      
      // Update the action card
      let linkButton = actioncard.querySelector('a[data-action="link-agenda"]');
      linkButton.setAttribute('data-action', 'showLinkedAgenda');
      linkButton.setAttribute('data-linked-agenda', selectedAgendaId);
      linkButton.classList.add("pulse");
      linkButton.innerHTML = `
        <i class="ti ti-route text-${actionStatusClass} fs-4"></i>
        <span class="d-none d-md-block font-weight-medium fs-3">Linked Agenda</span>
      `;
      
      // Update the linked agenda notice with status-based styling
      LinkeAgendaNotice.innerHTML = `
        <div class="alert customize-alert alert-dismissible text-${actionStatusClass} border border-${actionStatusClass} fade show remove-close-icon" role="alert">
          <span class="side-line bg-${actionStatusClass}"></span>
          <div class="d-flex align-items-center">
            <i class="ti ti-info-circle fs-7 me-2 flex-shrink-0 text-${actionStatusClass} fs-4"></i>
            <span class="text-truncate">This action is linked to the agenda point: <span class="fs-4 fw-bold">#${selectedIndex} ${selectedAgendaItem.title || 'Untitled'}</span></span>
            <div class="ms-auto d-flex justify-content-end">
              <a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6" data-action="unLinkAgenda">
                <i class="ti ti-unlink fs-5 text-warning"></i>
                Unlink Agenda
              </a>
            </div>
          </div>
        </div>
      `;
      LinkeAgendaNotice.style.display = 'block';
      
      // Update the tree node if available
      if (actionNode) {
        actionNode.linkedAgenda = [{
          id: selectedAgendaId,
          index: selectedIndex,
          title: selectedAgendaItem.title || 'Untitled'
        }];
      }
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('L-A-modal'));
      modal.hide();
    });

    // Show the modal
    const myModal = new bootstrap.Modal(document.getElementById('L-A-modal'), {
      keyboard: false
    });
    myModal.show();
  }
  if (e.target.matches('a[data-action="unLinkAgenda"]')) {
    e.preventDefault();
    let actioncard = e.target.closest(".meenoe-action-card");
    let LinkeAgendaNotice = actioncard.querySelector('.linked-agenda-notice');
    let linkButton = actioncard.querySelector('a[data-action="showLinkedAgenda"]');
    
    // Reset the link button
    linkButton.setAttribute('data-action', 'link-agenda');
    linkButton.removeAttribute('data-linked-agenda');
    linkButton.classList.remove("pulse");
    linkButton.innerHTML = `
      <i class="ti ti-link-plus text-primary fs-4"></i>
      <span class="d-none d-md-block font-weight-medium fs-3">Link Agenda</span>
    `;
    
    // Clear the notice
    LinkeAgendaNotice.innerHTML = '';
    LinkeAgendaNotice.style.display = 'none';
    
    // Update the tree node if available
    let node = tree.findNodeByID(actioncard.id);
    if (node) {
      node.linkedAgenda = [];
    }
  }
  if (e.target.matches('a[data-action="showLinkedAgenda"]')) {
    e.preventDefault();
    // Get the data-linked-agenda attribute
    let dataLinkedAgenda = e.target.getAttribute('data-linked-agenda');
    
    // Find the agenda item in AgendaFlow
    if (window.agendaFlow && window.agendaFlow.state.agendaItems) {
      const agendaItem = window.agendaFlow.state.agendaItems.get(dataLinkedAgenda);
      if (agendaItem) {
        // Find the agenda item element in the DOM and scroll to it
        const agendaElement = document.querySelector(`[data-agenda-id="${dataLinkedAgenda}"]`);
        if (agendaElement) {
          customSmoothScrollTo(agendaElement);
          
          // Highlight the agenda item
          if (window.agendaFlow.highlightAgendaItem) {
            window.agendaFlow.highlightAgendaItem(dataLinkedAgenda);
          }
          
          // Optionally, select the agenda item to show details
          if (window.agendaFlow.selectAgendaItem) {
            window.agendaFlow.selectAgendaItem(agendaElement);
          }
        } else {
          // If not found in DOM, try alternative selector
          const fallbackElement = document.getElementById(dataLinkedAgenda);
          if (fallbackElement) {
            customSmoothScrollTo(fallbackElement);
          } else {
            console.warn('Linked agenda item not found in DOM:', dataLinkedAgenda);
            alert('The linked agenda point could not be found. It may have been deleted.');
          }
        }
      } else {
        console.warn('Linked agenda item not found in AgendaFlow state:', dataLinkedAgenda);
        alert('The linked agenda point could not be found. It may have been deleted.');
      }
    } else {
      // Fallback to original behavior
      const elem = document.querySelector('#' + dataLinkedAgenda);
      if (elem) {
        customSmoothScrollTo(elem);
      } else {
        alert('The linked agenda point could not be found.');
      }
    }
  }
  if (e.target.matches('a[data-action="collapse"]')) {
    e.preventDefault();
    const card = e.target.closest(".card");
    const icon = card.querySelector('[data-action="collapse"] i');
    const body = card.querySelector(".card-body");
    icon.classList.toggle("ti-minus");
    icon.classList.toggle("ti-plus");
    body.classList.toggle("d-sm-none");
  }
  // collapse agenda note internal items 
  if (e.target.matches('a[data-action="collapse-internal"]')) {
    e.preventDefault();
    var card = e.target.closest(".collapse-parent");
    var icon = e.target.querySelector('i');
    icon.classList.toggle("ti-notes");
    icon.classList.toggle("ti-notes-off");
    var body = card.querySelector(".collapse-child-note");
    body.style.display = body.style.display === "none" ? "" : "none";
  }
  // collapse agenda file internal items 
  if (e.target.matches('a[data-action="collapse-file"]')) {
    e.preventDefault();
    var card = e.target.closest(".collapse-parent");
    var icon = e.target.querySelector('i');
    icon.classList.toggle("ti-file-plus");
    icon.classList.toggle("ti-file-off");
    var body = card.querySelector(".collapse-child-file");
    body.style.display = body.style.display === "none" ? "" : "none";
  }
  //minimize all cards
  if (e.target.matches('a[data-action="collapse-all"]')) {
    e.preventDefault();
    // Find the div with id 'div_tree'
    let divTree = document.getElementById('div_tree');
    // Find all divs with the class 'card' within 'div_tree'
    var cards = divTree.getElementsByClassName('card');

    // Toggle the button text and icon
    var toggleButton = e.target;
    var buttonIcon = toggleButton.querySelector('i');
    var buttonText = toggleButton.querySelector('span');

    // Toggle the button icon
    buttonIcon.classList.toggle("ti-minus");
    buttonIcon.classList.toggle("ti-plus");

    // Toggle the button text
    if (buttonText.textContent === "Open all cards") {
      buttonText.textContent = "Close all cards";
    } else {
      buttonText.textContent = "Open all cards";
    }

    // Iterate through each 'card' and find '.card-body' to toggle display
    Array.from(cards).forEach(function(card) {
      var cardBody = card.querySelector(".card-body");
      var icon = card.querySelector('[data-action="collapse"] i');
      icon.classList.toggle("ti-minus");
      icon.classList.toggle("ti-plus");
      if (cardBody) {
        cardBody.style.display = cardBody.style.display === "none" ? "" : "none";
      }
    });
  }
});

// editable titles
// Function to toggle contentEditable
function toggleContentEditable(event) {
  const isEditableClass = event.target.classList.contains('meenoe-ed-title');
  if (isEditableClass) {
    event.target.contentEditable = true;
    let range = document.createRange();
    range.selectNodeContents(event.target); // Select all contents
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    event.target.focus();
  }
}

// Function to set contentEditable to false when focus is lost or Enter is pressed
function disableContentEditable(event) {
  if (event.target.classList.contains('meenoe-ed-title')) {
    if (event.target.closest('.adcard')) {
      let agendaPoint = event.target.closest('.adcard');
      let agendaID = agendaPoint.id;
      if (event.target.textContent.trim() === '') {
        event.target.textContent = 'Click to enter name';
      }
      event.target.contentEditable = false;
      agenda.setName(agendaID, event.target.innerText);
    } else if (event.target.closest('.meenoe-action-card')) {
      let actionItem = event.target.closest('.meenoe-action-card');
      let actionItemID = actionItem.id;
      if (event.target.textContent.trim() === '') {
        event.target.textContent = 'Click to enter name';
      }
      event.target.contentEditable = false;
      tree.setName(actionItemID, event.target.innerText);
    }

    // Check if the element has the class 'meenoe-title'
    if (event.target.classList.contains('meenoe-title')) {
      if (event.target.textContent.trim() === '') {
        event.target.textContent = meenoe.meenoeID;
      }
      event.target.contentEditable = false;
      meenoe.meenoeName = event.target.innerText;
    }
  }
}

 //  click events
document.addEventListener('click', function(event) {
  // Add Action button (event delegation, works for dynamic content)
  if (event.target.closest('#meenoe-add-action')) {
    event.preventDefault();
    removeZeroActionsPlaceholder();
    if (typeof tree !== 'undefined' && tree) {
      tree.createNode('New Action', false, null, null, null, 'context1');
    } else {
      console.error("meenoeInit.js: Error - 'tree' is not defined on 'meenoe-add-action' click.");
    }
    return;
  }
  //Event delegation to handle click events on elements with the 'meenoe-ed-title' class
  if (event.target.closest('.meenoe-ed-title') && event.target.contentEditable !== "true") {
    toggleContentEditable(event);
  }
  if (event.target.closest('#publish-review')) {
    // Show the modal with id "publishModal"
    const publishModal = document.getElementById('publishModal');
    const modal = new bootstrap.Modal(publishModal);
    modal.show();
    
    // Find the modal-body element and change its innerHTML
    const modalBody = publishModal.querySelector('.modal-body');
    modalBody.innerHTML = `
    <div class="text-center text-warning">
      <i class="ti ti-eye-check i-fs-alert"></i>
      <h3 class="mt-2">Wait!</h3>
      <p class="mt-3 fs-5">
        You are about to publish this meenoe in review mode, are you sure you want to do that?
      </p>
    </div>
    `;
    const confirmButton = publishModal.querySelector('#confirmPublish');
    confirmButton.setAttribute('data-status', 'review');
  }
  if (event.target.closest('#publish-admin-review')) {
    const publishModal = document.getElementById('publishModal');
    const modal = new bootstrap.Modal(publishModal);
    modal.show();
    
    // Find the modal-body element and change its innerHTML
    const modalBody = publishModal.querySelector('.modal-body');
    modalBody.innerHTML = `
    <div class="text-center text-warning">
      <i class="ti ti-thumb-up i-fs-alert"></i>
      <h3 class="mt-2">Wait!</h3>
      <p class="mt-3 fs-5">
        You are about to publish this meenoe in admin review mode, are you sure you want to do that?
      </p>
    </div>
    `;
    
    // Find the confirmPublish button and set its data-status attribute
    const confirmButton = publishModal.querySelector('#confirmPublish');
    confirmButton.setAttribute('data-status', 'admin-review');
  }
  if (event.target.closest('#publish-live')) {
    // Show the modal with id "publishModal"
    const publishModal = document.getElementById('publishModal');
    const modal = new bootstrap.Modal(publishModal);
    modal.show();
    
    // Find the modal-body element and change its innerHTML
    const modalBody = publishModal.querySelector('.modal-body');
    modalBody.innerHTML = `
    <div class="text-center text-warning">
      <i class="ti ti-door-enter i-fs-alert"></i>
      <h3 class="mt-2">Wait!</h3>
      <p class="mt-3 fs-5">
        You are about to make this meenoe live, are you sure you want to do that?
      </p>
    </div>
    `;
    
    // Find the confirmPublish button and set its data-status attribute
    const confirmButton = publishModal.querySelector('#confirmPublish');
    confirmButton.setAttribute('data-status', 'live');
  }
  if (event.target.closest('#publish-locked')) {
    // Show the modal with id "publishModal"
    const publishModal = document.getElementById('publishModal');
    const modal = new bootstrap.Modal(publishModal);
    modal.show();
    
    // Find the modal-body element and change its innerHTML
    const modalBody = publishModal.querySelector('.modal-body');
    modalBody.innerHTML = `
    <div class="text-center text-warning">
      <i class="ti ti-lock i-fs-alert"></i>
      <h3 class="mt-2">Wait!</h3>
      <p class="mt-3 fs-5">
        You are about to lock this meenoe. This will prevent any new items from being added, but existing items can still be updated, are you sure you want to do that?
      </p>
    </div>
    `;
    
    // Find the confirmPublish button and set its data-status attribute
    const confirmButton = publishModal.querySelector('#confirmPublish');
    confirmButton.setAttribute('data-status', 'locked');
  }
  if (event.target.closest('#publish-closed')) {
    // Show the modal with id "publishModal"
    const publishModal = document.getElementById('publishModal');
    const modal = new bootstrap.Modal(publishModal);
    modal.show();
      console.log(meenoe);
    
    // Find the modal-body element and change its innerHTML
    const modalBody = publishModal.querySelector('.modal-body');
    modalBody.innerHTML = `
    <div class="text-center text-warning">
      <i class="ti ti-door-exit i-fs-alert"></i>
      <h3 class="mt-2">Wait!</h3>
      <p class="mt-3 fs-5">
        You are about to close this meenoe stopping all updates. This action cannot be undone, are you sure you want to do that?
      </p>
    </div>
    `;
    
    // Find the confirmPublish button and set its data-status attribute
    const confirmButton = publishModal.querySelector('#confirmPublish');
    confirmButton.setAttribute('data-status', 'closed');
  }

  //publish modal actions
  if (event.target.closest('#confirmPublish')) {
    const confirmButton = event.target.closest('#confirmPublish');
    const publishModal = document.getElementById('publishModal');
    const modal = bootstrap.Modal.getInstance(publishModal);
    const statusBadge = document.getElementById('meenoe-status-badge');

    //review
    if (confirmButton.getAttribute('data-status') === 'review') {
      confirmButton.blur();
      pubReview(modal);
    }
    //admin review
    if (confirmButton.getAttribute('data-status') === 'admin-review') {
      confirmButton.blur();
      pubAdminReview(modal);
    }
    //live
    if (confirmButton.getAttribute('data-status') === 'live') {
      confirmButton.blur();
      pubLive(modal);
    }
    //locked
    if (confirmButton.getAttribute('data-status') === 'locked') {
      confirmButton.blur();
      pubLocked(modal);
    }
    //closed
    if (confirmButton.getAttribute('data-status') === 'closed') {
      confirmButton.blur();
      pubClose(modal);
    }
  }
});


// Function to remove elements with class "disoc"
function removeDisocElements() {
  const disocElements = document.querySelectorAll('.disoc');
  disocElements.forEach(element => {
    // Hide the element using a CSS class instead of inline style
    element.classList.add('d-sm-none');
    
    // Disable the element
    element.setAttribute('disabled', 'disabled');
    element.setAttribute('aria-hidden', 'true');
    
    // Add a click event listener to prevent any actions
    element.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }, true);
    
    // For form elements
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' || element.tagName === 'BUTTON') {
      element.disabled = true;
    }
    
    // For anchor tags
    if (element.tagName === 'A') {
      element.href = 'javascript:void(0)';
    }
  });
}

// Function to remove the class "meenoe-ed-title" from elements
function removeMeenoeEdTitleClass() {
  const meenoeEdTitleElements = document.querySelectorAll('.meenoe-ed-title');
  meenoeEdTitleElements.forEach(element => {
    element.classList.remove('meenoe-ed-title');
  });
}

// Event delegation to handle blur events on elements with the 'meenoe-ed-title' class
document.addEventListener('blur', function(event) {
  if (event.target.classList.contains('meenoe-ed-title')) {
    disableContentEditable(event);
  }
}, true);

// Event listener for keydown to disable contentEditable on Enter press
document.addEventListener('keydown', function(event) {
  if (event.target.classList.contains('meenoe-ed-title') && event.key === 'Enter') {
    event.preventDefault(); // Prevent the default Enter key action
    disableContentEditable(event);
  }
  if (event.target.classList.contains('meenoe-title') && event.key === 'Enter') {
    event.preventDefault();
    disableContentEditable(event);
    console.log('disable typing on title');
  }
});

//end

// select an action from the dropdown and update the action card 
var meenoeActionsElement = document.querySelector('#meenoe-actions');
if (meenoeActionsElement) {
  meenoeActionsElement.addEventListener('click', function(e) {
  if (e.target.classList.contains("action-search-input")) {
    let SelectedAction = e.target.closest('.meenoe-action-card');
    var searchInput = SelectedAction.querySelector('.action-search-input');
    searchInput.addEventListener('keyup', event => {
      var input, filter, items, dividers, i;
      input = SelectedAction.querySelector('.action-search-input');
      filter = input.value.toUpperCase();
      items = SelectedAction.querySelectorAll('.meenoe-action-menu-col .menu-item');
      dividers = SelectedAction.querySelectorAll('.meenoe-action-menu-col .dropdown-divider');

      for (i = 0; i < items.length; i++) {
        if (items[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
          items[i].style.display = "";
        } else {
          items[i].style.display = "none";
        }
      }

      for (i = 0; i < dividers.length; i++) {
        if (filter === "") {
          dividers[i].style.display = "";
        } else {
          dividers[i].style.display = "none";
        }
      }
    });
  }
  //check if action dropdown is selected
  if (event.target.classList.contains("meenoe-action-select")) {
    let SelectedAction = e.target.closest('.meenoe-action-card');
    let dropdownItems = SelectedAction.querySelectorAll('.menu-item a');
    let node = tree.findNodeByID(SelectedAction.id);
    let actionStatus = node.actionStatus;
    let actionStatusClass = 'warning';
    if (actionStatus === 'open') {
      actionStatusClass = 'warning';
    } else if (actionStatus === 'pending') {
      actionStatusClass = 'primary';
    } else if (actionStatus === 'complete') {
      actionStatusClass = 'success';
    } else if (actionStatus === 'queued') {
      actionStatusClass = 'dark';
    }
    let dropdownMenu = SelectedAction.querySelector('.action-categories');
    dropdownMenu.addEventListener('click', function(event) {
      event.stopPropagation();
      //auto scroll to the first item in the actions list when a category is clicked
      let categoryOptions = SelectedAction.querySelectorAll('.category-title a');
      let itemsContainer = SelectedAction.querySelector('.meenoe-action-items');
      categoryOptions.forEach(option => {
        option.addEventListener('click', event => {
          event.preventDefault();
          let category = option.parentElement.getAttribute('data-category');
          let firstItemInCategory = itemsContainer.querySelector(`.menu-item[data-category="${category}"]`);

          if (firstItemInCategory) {
            let position = firstItemInCategory.offsetTop;
            position = position - 80;
            itemsContainer.scrollTo({
              top: position,
              behavior: 'smooth'
            });
          }
        });
      });
    });

    // Add event listener to each dropdown item
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        let divTree = document.getElementById('div_tree');
        divTree.style.height = 'auto';

        // Find the closest "meenoe-action-card" to the clicked item
        let card = e.target.closest('.meenoe-action-card');
        if (!card) return; // If no card is found, exit the function
        let actionSelect = card.querySelector('.action-selector');
        if (!actionSelect) return; // If no action select is found, exit the function

        actionSelect.innerHTML = `
				<div class="d-flex align-items-center gap-3">
				  <div class="meenoe-action-info-icon p-6 bg-${actionStatusClass}-super-subtle rounded d-flex align-items-center justify-content-center">
					<i class="ti ti-grid-dots text-${actionStatusClass} fw-semibold fs-7"></i>
				  </div>
				  <div>
					<h6 class="meenoe_action_type fs-4 fw-semibold">
					  
					</h6>
					<div class="meenoe-action-date fs-2 text-muted">
					  
					</div>
				  </div>
				  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-info ms-auto">
					<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
				  </button>
				</div>
				<h6 class="meenoe_action_description text-muted fw-normal mt-2">
				  
				</h6>
				`;

        // Update the "meenoe-action-type" h6
        let actionType = actionSelect.querySelector('.meenoe_action_type');
        if (actionType) {
          actionType.textContent = e.target.textContent.trim(); // Use the text of the clicked item
        }

        // Update the "meenoe-action-info-icon" i element class
        let actionIcon = actionSelect.querySelector('.meenoe-action-info-icon');
        let actionI = actionSelect.querySelector('.meenoe-action-info-icon i');
        if (actionIcon) {
          // Add the class of the clicked item's icon
          let clickedIconClass = e.target.querySelector('i').className;
          actionI.className = clickedIconClass;
          actionI.classList.remove("me-2");
          actionI.classList.add('text-' + actionStatusClass, 'fs-6');
        }

        // Set the "meenoe-action-date" p to the current date
        let actionDate = actionSelect.querySelector('.meenoe-action-date');
        if (actionDate) {
          let currentDate = new Date();
          let formattedDate = currentDate.toLocaleDateString();
          actionDate.textContent = formattedDate;
          let node = tree.findNodeByID(card.id);
          node.actionDate = formattedDate;
        }
        let actionDesc = actionSelect.querySelector('.meenoe_action_description');
        // Define the map of action types to descriptions
        const actionDescriptions = {
          "Approvals": "Approvals are crucial for ensuring that decisions are made collectively and with full understanding of the implications.\nThis process involves reviewing and approving documents or proposals.",
          "Surveys": "Surveys are essential for gathering feedback and insights from various stakeholders.\nThey help in understanding the needs, preferences, and opinions of the participants.",
          "Signing": "Signing is a formal way of agreeing to terms or conditions.\nIt's often used in legal documents, contracts, or agreements to validate the consent of the parties involved.",
          "Project": "Projects are structured efforts to create a product, service, or result.\nThey involve planning, execution, and monitoring to achieve specific goals within a defined timeframe",
          "Voting": "Voting is a democratic process where individuals express their preferences for a particular choice.\nIt's used in decision-making processes to select options based on majority or consensus",
          "Tasklist": "Tasklists are lists of tasks or activities that need to be completed.\nThey help in organizing work, tracking progress, and ensuring that all necessary steps are taken",
          "Brainstorming": "Brainstorming is a creative process to generate ideas and solutions.\nIt involves free thinking and discussion to explore various possibilities and innovations",
          "Documentation": "Documentation is the process of creating and maintaining records of information.\nIt's crucial for preserving knowledge, facilitating communication, and ensuring accountability",
          "Policies": "Policies are rules or guidelines established by an organization to govern its operations.\nThey help in maintaining standards, ensuring consistency, and promoting ethical behavior",
          "Discussion": "Discussion is a process of exchanging ideas and information among individuals or groups.\nIt's essential for problem-solving, decision-making, and fostering collaboration",
          "Resource Allocation": "Resource allocation is the process of distributing resources among various activities or projects.\nIt involves planning and managing resources efficiently to achieve optimal outcomes",
          "Reviews": "Reviews are processes of examining and evaluating work or materials.\nThey help in identifying strengths, weaknesses, and areas for improvement",
          "Feedback": "Feedback is information provided by an individual or group about the performance or quality of a product, service, or process.\nIt's crucial for continuous improvement and learning",
          "Assessments": "Assessments are evaluations of an individual's or group's knowledge, skills, or abilities.\nThey help in determining the level of competence and identifying areas for development",
          "Problem Solving": "Problem solving is the process of finding solutions to problems or challenges.\nIt involves identifying issues, analyzing them, and implementing effective strategies to overcome obstacles",
          "File Uploads": "File uploads are the process of transferring files from a local computer to a server or cloud storage.\nIt's essential for sharing documents, images, and other files with others",
          "Video": "Video is a medium used for communication, entertainment, education, and various other purposes. Quickly share your video recorded ideas, thoughts or information without needing to type.",
          "Audio": "Communicate your thoughts, ideas, and details through voice recorded messages in a quick and effective manner without needing to type.",
          "Presentation": "Presentations are formal or informal speeches or displays of information.\nThey are used to convey ideas, information, or arguments to an audience",
          "Integrations": "Integrations are the process of combining different systems or applications to work together seamlessly.\nIt's crucial for enhancing functionality, improving efficiency, and achieving synergy",
          "Custom Action": "Custom actions provide a versatile way to manage various aspects of your life. Simply define the specific action and the associated goal you aim to achieve, then manually track your progress towards it. This way, you can stay organized and focused on your objectives."
        };
        // Function to update the action description based on the action type
        // Check if the actionType exists in the map
        let actiondesct = actionType.innerText;
        if (actionDescriptions.hasOwnProperty(actiondesct)) {
          // Update the innerText of the "actionDesc" element with the description
          actionDesc.innerText = actionDescriptions[actiondesct];
        } else {
          // If the actionType is not found, you might want to handle this case, e.g., by setting a default description
          actionDesc.innerText = "No description available for this action type.";
        }
        //push to the meenoe state
        let node = tree.findNodeByID(card.id);
	      tree.serializeNodeById(node);
      });
    });
  }
  if (event.target.classList.contains("action-edit-info")) {
    e.preventDefault();
    let card = e.target.closest('.meenoe-action-card');
    let actionSelect = card.querySelector('.action-selector');
    let admin = true;

    if (admin) {
      actionSelect.innerHTML = `
			  <h6 class="mt-3 text-muted fw-normal">What type of action is this?</h6>
			  <div class="btn-group">
				<button class="btn btn-dark meenoe-action-select dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"  data-bs-popper-config='{"strategy":"fixed"}'>
				<i class="ti ti-tag me-2"></i>
				Action Tag
				</button>
				<div class="dropdown-menu actiondrop">
				  <div class="p-3">
					<input type="text" placeholder="Search actions.." class="form-control action-search-input">
				  </div>
				  <div class="meenoe-action-menu-col action-categories">
					<div class="category-title" data-category="Category 1">
					  <a class="dropdown-item" href="javascript:void(0)">
					  Meenoe Actions
					  </a>
					</div>
					<div class="category-title" data-category="Category 2">
					  <a class="dropdown-item" href="javascript:void(0)">
					  Interactive Actions
					  </a>
					</div>
					<div class="category-title" data-category="Category 3">
					  <a class="dropdown-item" href="javascript:void(0)">
					  Follow-up Actions
					  </a>
					</div>
					<div class="category-title" data-category="Category 4">
					  <a class="dropdown-item" href="javascript:void(0)">
					  Presentations and Files
					  </a>
					</div>
					<div class="category-title" data-category="Category 5">
					  <a class="dropdown-item" href="javascript:void(0)">
					  Linked Actions
					  </a>
					</div>
				  </div>
				  <div class="meenoe-action-menu-col meenoe-action-items">
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-square-check me-2"></i>
					  Approvals
					  </a>
					</div>
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-help-hexagon me-2"></i>
					  Surveys
					  </a>
					</div>
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-signature me-2"></i>
					  Signing
					  </a>
					</div>
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-layout-kanban me-2"></i>
					  Project
					  </a>
					</div>
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-ballpen me-2"></i>
					  Voting
					  </a>
					</div>
					<div class="menu-item" data-category="Category 1">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-checklist me-2"></i>
					  Tasklist
					  </a>
					</div>
					<div class="dropdown-divider w-90 mx-auto"></div>
					<!-- interactive actions category -->
					<div class="menu-item" data-category="Category 2">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-grain me-2"></i>
					  Brainstorming
					  </a>
					</div>
					<div class="menu-item" data-category="Category 2">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-file-description me-2"></i>
					  Documentation
					  </a>
					</div>
					<div class="menu-item" data-category="Category 2">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-notebook me-2"></i>
					  Policies
					  </a>
					</div>
					<div class="menu-item" data-category="Category 2">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-message-plus me-2"></i>
					  Discussion
					  </a>
					</div>
					<div class="menu-item" data-category="Category 2">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-target me-2"></i>
					  Resource Allocation
					  </a>
					</div>
					<div class="dropdown-divider w-90 mx-auto"></div>
					<!-- follow up actions category -->
					<div class="menu-item" data-category="Category 3">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-text-scan-2 me-2"></i>
					  Reviews
					  </a>
					</div>
					<div class="menu-item" data-category="Category 3">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-message-forward me-2"></i>
					  Feedback
					  </a>
					</div>
					<div class="menu-item" data-category="Category 3">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-square-rounded-check me-2"></i>
					  Assessments
					  </a>
					</div>
					<div class="menu-item" data-category="Category 3">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-mood-check me-2"></i>
					  Problem Solving
					  </a>
					</div>
					<div class="dropdown-divider w-90 mx-auto"></div>
					<!-- presentations and files actions category -->
					<div class="menu-item" data-category="Category 4">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-upload me-2"></i>
					  File Uploads
					  </a>
					</div>
					<div class="menu-item" data-category="Category 4">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-video me-2"></i>
					  Video
					  </a>
					</div>
					<div class="menu-item" data-category="Category 4">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-microphone me-2"></i>
					  Audio
					  </a>
					</div>
					<div class="menu-item" data-category="Category 4">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-presentation me-2"></i>
					  Presentation
					  </a>
					</div>
					<div class="dropdown-divider w-90 mx-auto"></div>
					<!-- linked actions category -->
					<div class="menu-item" data-category="Category 5">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-arrow-iteration me-2"></i>
					  Integrations
					  </a>
					</div>
					<div class="menu-item" data-category="Category 5">
					  <a class="dropdown-item" href="#">
					  <i class="ti ti-adjustments-check me-2"></i>
					  Custom Action
					  </a>
					</div>
					<!-- Repeat for more items -->
				  </div>
				  <div class="clear"></div>
				</div>
			  </div>
			`;
    }
    //push to the meenoe state
    //tree.serializeActions(tree);
  }
  if (event.target.classList.contains("action-edit-trigger")) {
    e.preventDefault();
    let card = e.target.closest('.meenoe-action-card');
    let triggershow = card.querySelector('.meenoe-action-trigger');
    let actionProgress = card.querySelector('.action-progress');
    let node = tree.findNodeByID(card.id);
    let admin = true;
    if (admin) {
      triggershow.innerHTML = `
	<h6 class="mt-3 text-muted fw-normal">What is the completion trigger for this action?</h6>
	  <div class="btn-group">
		<button class="btn btn-dark meenoe-trigger-select dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper-config="{&quot;strategy&quot;:&quot;fixed&quot;}">
		<i class="ti ti-pin-invoke me-2"></i>
		Action Trigger
		</button>
		<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Fluid - Never Closes
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Deadline
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Due Date
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Available Until
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Recurring
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Conditional
			</a>
		  </div>
		  <div class="trigger-item">
			<a class="dropdown-item" href="#">
			Approval based
			</a>
		  </div>
		</div>
	  </div>
	  `;
      actionProgress.style.display = 'block';
      //empty the action trigger for the specific node
      // console.log(node.actionTrigger);
      // node.actionTrigger = [];
      // console.log(node.actionTrigger);
      //push to the meenoe state
      //tree.serializeActions(tree);
    }
  }
  if (event.target.classList.contains("meenoe-trigger-select")) {
    e.preventDefault();
    let card = e.target.closest('.meenoe-action-card');
    let dropdownItems = card.querySelectorAll('.trigger-item a');
    let triggerSelector = card.querySelector('.meenoe-action-trigger');
    let triggerDisplay = card.querySelector('.action-ct-info');
    let actionProgress = card.querySelector('.action-progress');
    let node = tree.findNodeByID(card.id);
    let actionStatus = node.actionStatus;
    let actionStatusClass = 'warning';
    if (actionStatus === 'open') {
      actionStatusClass = 'warning';
    } else if (actionStatus === 'pending') {
      actionStatusClass = 'primary';
    } else if (actionStatus === 'complete') {
      actionStatusClass = 'success';
    } else if (actionStatus === 'queued') {
      actionStatusClass = 'dark';
    }
    let triggerArray = {
      triggerType: null,
      triggerStart: null,
      triggerDate: null,
      frequency: null,
      triggerEnd: null,
      conditionPercent: null,
      approved: null
    };

    // Add event listener to each trigger dropdown item
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        let divTree = document.getElementById('div_tree');
        divTree.style.height = 'auto';
        triggerSelector.innerHTML = '';

        if (item.textContent.trim() === "Fluid - Never Closes") {
          triggerSelector.innerHTML = `
					<div class="d-flex align-items-center justify-content-between mb-1">
					  <div class="d-flex">
						<div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
						  <i class="ti ti-ripple me-2"></i>
						  This action is always open, and never closes.
						</div>
					  </div>
					  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
						<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
					  </button>
					</div>
				  `;
          triggerArray.triggerType = "fluid";
          triggerArray.triggerStart = null;
          triggerArray.triggerDate = null;
          triggerArray.triggerEnd = null;
          triggerArray.frequency = null;
          triggerArray.conditionPercent = null;
          triggerArray.approved = null;
          node.actionTrigger = triggerArray;
	        //push to the meenoe state
	        //tree.serializeActions(tree);
	        tree.serializeNodeById(node);
        } else if (item.textContent.trim() === "Deadline") {
          let instructions = document.createElement('p');
          instructions.textContent = "Select the date you would like to set as your deadline";
          instructions.setAttribute('role', 'alert');

          let dateInput = document.createElement('input');
          dateInput.classList.add('form-control', 'dateInput-deadline', 'flatpickr-input');
          dateInput.placeholder = "Select a date";
          dateInput.type = 'text';
          dateInput.setAttribute('aria-label', 'Select a date');
          dateInput.setAttribute('readonly', 'readonly');

          triggerSelector.appendChild(instructions);
          triggerSelector.appendChild(dateInput);

          // Initialize flatpickr after element is in DOM
          setTimeout(() => {
            console.log('Initializing flatpickr for deadline input:', dateInput);
            
            if (typeof flatpickr === 'undefined') {
              console.error('Flatpickr is not loaded!');
              return;
            }
            
            try {
              const fp = flatpickr(dateInput, {
                dateFormat: "l F j, Y",
                allowInput: false,
                clickOpens: true,
                onChange: function(selectedDates, dateStr, instance) {
                  console.log('Date selected:', dateStr);
                  if (selectedDates.length > 0) {
                    triggerSelector.innerHTML = `
                              <div class="d-flex align-items-center justify-content-between mb-1">
                                  <div class="d-flex">
                                      <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                                          <i class="ti ti-clock-hour-9 me-2"></i>
                                          The deadline for this action is ${dateStr}
                                      </div>
                                  </div>
                                  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger" aria-label="Edit deadline">
                                      <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                                  </button>
                              </div>`;
                    triggerArray.triggerType = "deadline";
                    triggerArray.triggerStart = null;
                    triggerArray.triggerDate = dateStr;
                    triggerArray.triggerEnd = null;
                    triggerArray.frequency = null;
                    triggerArray.conditionPercent = null;
                    triggerArray.approved = null;
                    node.actionTrigger = triggerArray;
                    //push to the meenoe state
                    //tree.serializeActions(tree);
                    tree.serializeNodeById(node);
                  } else {
                    triggerSelector.innerHTML = '<p>No deadline selected</p>';
                  }
                },
                onClose: function(selectedDates, dateStr, instance) {
                  if (selectedDates.length === 0) {
                    alert('No date selected');
                  }
                }
              });
              console.log('Flatpickr initialized successfully:', fp);
            } catch (error) {
              console.error('Error initializing flatpickr:', error);
            }
          }, 100);
        } 
        else if (item.textContent.trim() === "Due Date") {
          let instructions = document.createElement('p');
          instructions.textContent = "Select the date you would like to set as the due date for this action";
          let dateInput = document.createElement('input');
          dateInput.classList.add('form-control', 'dateInput-due-date', 'flatpickr-input');
          dateInput.placeholder = "Select a date";
          dateInput.type = 'text';
          dateInput.setAttribute('aria-label', 'Select a due date');
          dateInput.setAttribute('readonly', 'readonly');

          triggerSelector.appendChild(instructions);
          triggerSelector.appendChild(dateInput);

          // Initialize flatpickr after element is in DOM
          setTimeout(() => {
            console.log('Initializing flatpickr for due date input:', dateInput);
            
            if (typeof flatpickr === 'undefined') {
              console.error('Flatpickr is not loaded!');
              return;
            }
            
            try {
              flatpickr(dateInput, {
                dateFormat: "l F j, Y",
                allowInput: false,
                clickOpens: true,
                onChange: function(selectedDates, dateStr, instance) {
                  if (selectedDates.length > 0) {
                    triggerSelector.innerHTML = `
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <div class="d-flex">
                          <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                            <i class="ti ti-clock-hour-7 me-2"></i>
                            This action is due on or before ${dateStr}
                          </div>
                        </div>
                        <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                          <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                        </button>
                      </div> 
                    `;
                    triggerArray.triggerType = "due date";
                    triggerArray.triggerStart = null;
                    triggerArray.triggerDate = dateStr;
                    triggerArray.triggerEnd = null;
                    triggerArray.frequency = null;
                    triggerArray.conditionPercent = null;
                    triggerArray.approved = null;
                    node.actionTrigger = triggerArray;
                    //push to the meenoe state
                    tree.serializeNodeById(node);
                  }
                }
              });
            } catch (error) {
              console.error('Error initializing flatpickr for due date:', error);
            }
          }, 100);
        } 
        else if (item.textContent.trim() === "Available Until") {
          let instructions = document.createElement('p');
          instructions.textContent = "Set the date after which this action will not be available";
          let dateInput = document.createElement('input');
          dateInput.classList.add('form-control', 'dateInput-available-until', 'flatpickr-input');
          dateInput.placeholder = "Select a date";
          dateInput.type = 'text';
          dateInput.setAttribute('aria-label', 'Select availability end date');
          dateInput.setAttribute('readonly', 'readonly');

          triggerSelector.appendChild(instructions);
          triggerSelector.appendChild(dateInput);

          // Initialize flatpickr after element is in DOM
          setTimeout(() => {
            console.log('Initializing flatpickr for available until input:', dateInput);
            
            if (typeof flatpickr === 'undefined') {
              console.error('Flatpickr is not loaded!');
              return;
            }
            
            try {
              flatpickr(dateInput, {
                dateFormat: "l F j, Y",
                allowInput: false,
                clickOpens: true,
                onChange: function(selectedDates, dateStr, instance) {
                  if (selectedDates.length > 0) {
                    triggerSelector.innerHTML = `
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <div class="d-flex">
                          <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                            <i class="ti ti-clock-hour-7 me-2"></i>
                            This action will be available until ${dateStr}
                          </div>
                        </div>
                        <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                          <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                        </button>
                      </div>  
                    `;
                    triggerArray.triggerType = "available until";
                    triggerArray.triggerStart = null;
                    triggerArray.triggerDate = dateStr;
                    triggerArray.triggerEnd = null;
                    triggerArray.frequency = null;
                    triggerArray.conditionPercent = null;
                    triggerArray.approved = null;
                    node.actionTrigger = triggerArray;
                    //push to the meenoe state
                    tree.serializeNodeById(node);
                  }
                }
              });
            } catch (error) {
              console.error('Error initializing flatpickr for available until:', error);
            }
          }, 100);
        } 
        else if (item.textContent.trim() === "Conditional") {
          let instructions = document.createElement('p');
          instructions.textContent = "Set the progress percentage where this action can be considered complete";
          let percentageInput = document.createElement('input');
          percentageInput.classList.add('form-control', 'conditional-input');
          percentageInput.type = 'number';
          percentageInput.step = '0.01';
          percentageInput.min = '1';
          percentageInput.max = '100';
          percentageInput.pattern = '[0-9]+([\.][0-9]+)?';
          percentageInput.placeholder = 'Enter a percentage from 1% - 99% here';

          let setButtonGroup = document.createElement('div');
          setButtonGroup.classList.add('btn-group');
          let setButton = document.createElement('a');
          setButton.classList.add('btn', 'btn-dark', 'mt-3');
          setButton.textContent = 'Set';
          setButtonGroup.appendChild(setButton);

          triggerSelector.appendChild(instructions);
          triggerSelector.appendChild(percentageInput);
          triggerSelector.appendChild(setButtonGroup);

          setButton.addEventListener('click', function() {
            let percentage = Math.min(Math.max(parseInt(percentageInput.value), 1), 99);
            triggerSelector.innerHTML = `
              <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                    <i class="ti ti-progress-check me-2"></i>
                    This action will be considered complete once the progress surpasses or is at <strong>${percentage}</strong>%
                  </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
              </div>
            `;
            triggerArray.triggerType = "conditional";
            triggerArray.triggerStart = null;
            triggerArray.triggerDate = null;
            triggerArray.triggerEnd = null;
            triggerArray.frequency = null;
            triggerArray.conditionPercent = percentage;
            triggerArray.approved = null;
            node.actionTrigger = triggerArray;
		        //push to the meenoe state
		        tree.serializeNodeById(node);
          });
        } 
        else if (item.textContent.trim() === "Approval based") {
          triggerSelector.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex">
                <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                  <i class="ti ti-file-like me-2"></i>
                  This action is pending approval and has not yet been approved.
                </div>
              </div>
              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
                <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
              </button>
            </div>
          `;
          triggerArray.triggerType = "approval";
          triggerArray.triggerStart = null;
          triggerArray.triggerDate = null;
          triggerArray.triggerEnd = null;
          triggerArray.frequency = null;
          triggerArray.conditionPercent = null;
          triggerArray.approved = false;
          node.actionTrigger = triggerArray;
	        //push to the meenoe state
	        tree.serializeNodeById(node);
        } 
        else if (item.textContent.trim() === "Recurring") {
          let instructions = document.createElement('p');
          instructions.textContent = "Set up your recurring schedule";

          let startDateLabel = document.createElement('label');
          startDateLabel.textContent = "Start Date";
          startDateLabel.classList.add('form-label');

          let startDateInput = document.createElement('input');
          startDateInput.classList.add('form-control', 'startDate-recurring', 'flatpickr-input');
          startDateInput.placeholder = "Select a start date";
          startDateInput.type = 'text';
          startDateInput.setAttribute('readonly', 'readonly');

          let frequencyLabel = document.createElement('label');
          frequencyLabel.textContent = "Frequency";
          frequencyLabel.classList.add('form-label');

          let frequencySelect = document.createElement('select');
          frequencySelect.classList.add('form-select', 'frequency-recurring');
          ["Daily", "Weekly", "Monthly"].forEach(freq => {
            let option = document.createElement('option');
            option.value = freq.toLowerCase();
            option.textContent = freq;
            frequencySelect.appendChild(option);
          });

          let repeatLabel = document.createElement('label');
          repeatLabel.textContent = "Repeat";
          repeatLabel.classList.add('form-label');

          let repeatSelect = document.createElement('select');
          repeatSelect.classList.add('form-select', 'repeat-recurring');
          ["Twice", "Three times", "Four times", "Forever", "Custom"].forEach(rep => {
            let option = document.createElement('option');
            option.value = rep.toLowerCase();
            option.textContent = rep;
            repeatSelect.appendChild(option);
          });

          let repeatCountLabel = document.createElement('label');
          repeatCountLabel.textContent = "Repeat Count";
          repeatCountLabel.classList.add('form-label');
          repeatCountLabel.style.display = 'none';

          let repeatCountInput = document.createElement('input');
          repeatCountInput.classList.add('form-control', 'repeat-count');
          repeatCountInput.placeholder = "Enter repeat count";
          repeatCountInput.type = 'number';
          repeatCountInput.style.display = 'none';

          let setButton = document.createElement('button');
          setButton.classList.add('btn', 'btn-dark', 'mt-3');
          setButton.textContent = 'Set Schedule';

          repeatSelect.addEventListener('change', function() {
            if (repeatSelect.value === 'custom') {
              repeatCountLabel.style.display = 'block';
              repeatCountInput.style.display = 'block';
            } else {
              repeatCountLabel.style.display = 'none';
              repeatCountInput.style.display = 'none';
            }
          });

          setButton.addEventListener('click', function() {
            let startDate = flatpickr.parseDate(startDateInput.value, "l F j, Y");
            let frequency = frequencySelect.value;
            let repeatValue = repeatSelect.value;
            let repeatCount = repeatValue === 'custom' ? parseInt(repeatCountInput.value) :
              repeatValue === 'twice' ? 2 :
              repeatValue === 'three times' ? 3 :
              repeatValue === 'four times' ? 4 : Infinity;

            if (isNaN(startDate) || isNaN(repeatCount) || repeatCount < 1) {
              alert('Invalid input. Please check the start date and repeat count.');
              return;
            }

            let scheduleDates = [];
            let currentDate = new Date(startDate);
            let fiveYearsFromStart = new Date(startDate);
            fiveYearsFromStart.setMonth(fiveYearsFromStart.getMonth() + 4);


            while (repeatCount !== 0 && currentDate <= fiveYearsFromStart) {
              scheduleDates.push(new Date(currentDate));
              if (frequency === 'daily') {
                currentDate.setDate(currentDate.getDate() + 1);
              } else if (frequency === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
              } else if (frequency === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
              }
              repeatCount--;
            }

            if (repeatCount === 2) {
              scheduleDates.push(new Date(currentDate));
              if (frequency === 'daily') {
                currentDate.setDate(currentDate.getDate() + 1);
              } else if (frequency === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
              } else if (frequency === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
              }
              repeatCount--;
            }

            //console.log('Scheduled Dates:', scheduleDates);

            let nextDate = scheduleDates.find(date => date > new Date());
            if (nextDate) {
              triggerSelector.innerHTML = `
					  <div class="d-flex align-items-center justify-content-between mb-1">
						<div class="d-flex">
						  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
							<i class="ti ti-calendar me-2"></i>
							This is a recurring action which happens once ${frequency}. The next occurrence is scheduled for ${nextDate.toDateString()}
						  </div>
						</div>
						<button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger">
						  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
						</button>
					  </div>
					`;
              triggerArray.triggerType = "recurring";
              triggerArray.triggerStart = startDate.toDateString();
              triggerArray.triggerDate = nextDate.toDateString();
              triggerArray.triggerEnd = null;
              triggerArray.frequency = frequency;
              triggerArray.conditionPercent = null;
              triggerArray.approved = false;
              node.actionTrigger = triggerArray;
			        //push to the meenoe state
			        tree.serializeNodeById(node);
            } else {
              triggerSelector.innerHTML = '<p>No upcoming dates</p>';
            }
          });

          triggerSelector.appendChild(instructions);
          triggerSelector.appendChild(startDateLabel);
          triggerSelector.appendChild(startDateInput);
          triggerSelector.appendChild(frequencyLabel);
          triggerSelector.appendChild(frequencySelect);
          triggerSelector.appendChild(repeatLabel);
          triggerSelector.appendChild(repeatSelect);
          triggerSelector.appendChild(repeatCountLabel);
          triggerSelector.appendChild(repeatCountInput);
          triggerSelector.appendChild(setButton);

          // Initialize flatpickr after element is in DOM
          setTimeout(() => {
            console.log('Initializing flatpickr for recurring start date input:', startDateInput);
            
            if (typeof flatpickr === 'undefined') {
              console.error('Flatpickr is not loaded!');
              return;
            }
            
            try {
              flatpickr(startDateInput, {
                dateFormat: "l F j, Y",
                allowInput: false,
                clickOpens: true
              });
            } catch (error) {
              console.error('Error initializing flatpickr for recurring:', error);
            }
          }, 100);
        }
      });
    });
  }

  }); // Closes the event listener function for #meenoe-actions
} else {
  console.warn("meenoeInit.js: Element matching query '#meenoe-actions' not found.");
}

/**
 * Validate and update linked agenda for all actions
 * This should be called when agenda items are deleted or modified
 */
function validateLinkedAgendas() {
  if (!window.agendaFlow || !tree) return;
  
  const agendaItems = window.agendaFlow.state.agendaItems;
  
  // Function to recursively validate nodes
  function validateNode(node) {
    if (node.linkedAgenda && node.linkedAgenda.length > 0) {
      const linkedItem = node.linkedAgenda[0];
      if (linkedItem && linkedItem.id && !agendaItems.has(linkedItem.id)) {
        // Agenda item no longer exists, clear the link
        node.linkedAgenda = [];
        
        // Update the UI if the action card exists
        const actionCard = document.getElementById(node.id);
        if (actionCard) {
          const linkButton = actionCard.querySelector('a[data-action="showLinkedAgenda"]');
          const linkAgendaNotice = actionCard.querySelector('.linked-agenda-notice');
          
          if (linkButton) {
            linkButton.setAttribute('data-action', 'link-agenda');
            linkButton.removeAttribute('data-linked-agenda');
            linkButton.classList.remove('pulse');
            linkButton.innerHTML = `
              <i class="ti ti-link-plus text-primary fs-4"></i>
              <span class="d-none d-md-block font-weight-medium fs-3">Link Agenda</span>
            `;
          }
          
          if (linkAgendaNotice) {
            linkAgendaNotice.innerHTML = '';
            linkAgendaNotice.style.display = 'none';
          }
        }
      }
    }
    
    // Recursively validate child nodes
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(childNode => validateNode(childNode));
    }
  }
  
  // Validate all root nodes
  if (tree.childNodes && tree.childNodes.length > 0) {
    tree.childNodes.forEach(node => validateNode(node));
  }
}
