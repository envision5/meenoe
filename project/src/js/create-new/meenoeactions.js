// Utility function to remove zero-actions placeholder if it exists
function removeZeroActionsPlaceholder() {
  const zeroActionsElement = document.getElementById('zero-actions');
  if (zeroActionsElement) {
    zeroActionsElement.remove();
    return true;
  }
  return false;
}

function createTree(p_div, p_backColor, p_contextMenu) {
  const collapseSvg = '<svg  width="20"  height="20"  viewBox="0 0 24 24"  fill="#49beff"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" /></svg>';
  const expandSvg = '<svg width="20" height="20" viewBox="0 0 100 100"   fill="#fa896b" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect x="0" y="0" width="100" height="100" style="fill:none;fill-rule:nonzero;"/><path d="M33.336,25.008c0,-3.55 4.108,-5.404 6.763,-3.263l0.35,0.317l25,25c1.477,1.477 1.626,3.849 0.345,5.5l-0.345,0.392l-25,25l-0.392,0.345l-0.321,0.225l-0.4,0.225l-0.15,0.071l-0.279,0.113l-0.45,0.133l-0.221,0.042l-0.25,0.041l-0.237,0.017l-0.492,0l-0.242,-0.021l-0.25,-0.037l-0.216,-0.042l-0.45,-0.133l-0.28,-0.113l-0.55,-0.291l-0.375,-0.271l-0.337,-0.304l-0.346,-0.392l-0.225,-0.321l-0.225,-0.4l-0.071,-0.15l-0.112,-0.279l-0.134,-0.45l-0.041,-0.221l-0.042,-0.25l-0.017,-0.237l-0.008,-50.246Z" style="fill-rule:nonzero;"/></svg>';
  const rootSVG = `
  <svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-square-rotated"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.793 2.893l-6.9 6.9c-1.172 1.171 -1.172 3.243 0 4.414l6.9 6.9c1.171 1.172 3.243 1.172 4.414 0l6.9 -6.9c1.172 -1.171 1.172 -3.243 0 -4.414l-6.9 -6.9c-1.171 -1.172 -3.243 -1.172 -4.414 0z" /></svg>
  `;
  let tree = {
    name: 'tree',
    treeID: 'actionTree' + generateUniqueId(),
    div: p_div,
    ulElement: null,
    childNodes: [],
    backcolor: p_backColor,
    contextMenu: p_contextMenu,
    selectedNode: null,
    nodeCounter: 0,
    contextMenuDiv: null,
    rendered: false,
    createNode: function(p_text, p_expanded, p_icon, p_parentNode, p_tag, p_contextmenu) {
      v_tree = this;
      // Remove zero-actions placeholder when creating a new node
      removeZeroActionsPlaceholder();
      node = {
        id: 'action_' + generateUniqueId(),
        actionStatus: 'open',
        actionTitle: p_text,
        actionDate: null,
        actionType: null,
        actionTrigger: [],
        actionUsers: [], // Initialize as empty array
        progressNumber: 0,
        icon: p_icon,
        parent: p_parentNode,
        expanded: p_expanded,
        childNodes: [],
        tag: p_tag,
        contextMenu: p_contextmenu,
        elementLi: null,
        linkedAgenda: [],
        removeNode: function() {
          v_tree.removeNode(this);
        },
        removeNode1: function() {
          v_tree.removeNode1(this);
        },
        toggleNode: function(p_event) {
          v_tree.toggleNode(this);
        },
        expandNode: function(p_event) {
          v_tree.expandNode(this);
        },
        expandSubtree: function() {
          v_tree.expandSubtree(this);
        },
        setText: function(p_text) {
          v_tree.setText(this, p_text);
        },
        collapseNode: function() {
          v_tree.collapseNode(this);
        },
        collapseSubtree: function() {
          v_tree.collapseSubtree(this);
        },
        removeChildNodes: function() {
          v_tree.removeChildNodes(this);
        },
        createChildNode: function(p_text, p_expanded, p_icon, p_tag, p_contextmenu) {
          let childNode = v_tree.createNode(p_text, p_expanded, p_icon, this, p_tag, p_contextmenu);
          v_tree.expandNode(this);
          customSmoothScrollTo(childNode.elementLi);
          return childNode;
        }
      }
      if (this.rendered) {
        let v_exp_col = null;
        if (p_parentNode == undefined) {
          this.drawNode(this.ulElement, node);
          this.adjustLines(this.ulElement, false);
        } else {
          let v_ul = p_parentNode.elementLi.getElementsByTagName("ul")[0];
          if (p_parentNode.childNodes.length == 0) {
            if (p_parentNode.expanded) {
              p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'block';
              v_exp_col = createSimpleElement('meenoe-exp', 'toggle_off', 'exp_col');
              v_exp_col.innerHTML = collapseSvg;
              v_exp_col.style.visibility = "visible";
              v_exp_col.id = 'toggle_off';
            } else {
              p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'none';
              v_exp_col = createSimpleElement('meenoe-exp', 'toggle_on', 'exp_col');
              v_exp_col.innerHTML = expandSvg;
              v_exp_col.style.visibility = "visible";
              v_exp_col.id = 'toggle_on';
            }
          }
          this.drawNode(v_ul, node);
          this.adjustLines(v_ul, false);
          let lastLiElement = v_ul.lastElementChild;
          if (lastLiElement && lastLiElement.previousElementSibling) {
            if (lastLiElement.previousElementSibling.classList.contains('meenoe-child-last')) {
              lastLiElement.previousElementSibling.classList.remove('meenoe-child-last');
              lastLiElement.previousElementSibling.classList.add('meenoe-child-li');
            }
          }
          if (p_parentNode != undefined) {
            node.parent = p_parentNode;
            if (p_parentNode.childNodes.length == 1) {
              let v_exp_col = p_parentNode.elementLi.getElementsByTagName("meenoe-exp")[0];
              if (v_exp_col) {
                v_exp_col.innerHTML = expandSvg;
                v_exp_col.style.visibility = "visible";
                v_exp_col.id = 'toggle_off';
              }
            }
          } else {
            this.childNodes.push(node);
            node.parent = this;
          }
        }
      }
      if (p_parentNode == undefined) {
        this.childNodes.push(node);
        node.parent = this;
        return node; // Fix: Return the node for root-level nodes too
      } else {
        p_parentNode.childNodes.push(node);
        // Check if we need to set the node to queued based on parent status
        this.updateNodeStatusBasedOnParent(node, p_parentNode);
        return node;
      }
    },
    updateNodeStatusBasedOnParent: function(node, parentNode) {
      if (!parentNode) return;
      
      // If parent is not complete or its trigger is not fluid, set child to queued
      if (parentNode.actionStatus !== 'complete') {
        // Check if parent has a fluid trigger
        let hasFluidTrigger = false;
        if (parentNode.actionTrigger && 
            parentNode.actionTrigger.triggerType === 'fluid') {
          hasFluidTrigger = true;
        }
        
        // If parent is not complete and doesn't have a fluid trigger, set child to queued
        if (!hasFluidTrigger) {
          node.actionStatus = 'queued';
          // Update UI if the node is already rendered
          if (this.rendered && node.elementLi) {
            this.updateNodeStatusUI(node);
          }
          // Recursively update all child nodes
          this.updateChildrenStatusRecursively(node);
        }
      }
    },
    
    updateChildrenStatusRecursively: function(node) {
      if (!node.childNodes || node.childNodes.length === 0) return;
      
      for (let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        childNode.actionStatus = node.actionStatus === 'complete' ? 'open' : 'queued';
        
        // Update UI if the node is already rendered
        if (this.rendered && childNode.elementLi) {
          this.updateNodeStatusUI(childNode);
        }
        
        // Recursively update grandchildren
        this.updateChildrenStatusRecursively(childNode);
      }
    },
    
    updateNodeStatusUI: function(node) {
      if (!this.rendered || !node.elementLi) return;
      
      // Get the action card element
      const actionCard = node.elementLi.querySelector('.meenoe-action-card');
      if (!actionCard) return;
      
      // Update status badge
      const statusBadge = actionCard.querySelector('.badge');
      if (statusBadge) {
        // Remove old status classes
        statusBadge.classList.remove('bg-warning-super-subtle', 'text-warning', 
                                   'bg-primary-super-subtle', 'text-primary',
                                   'bg-success-super-subtle', 'text-success',
                                   'bg-dark-super-subtle', 'text-dark');
        
        // Add new status classes
        let statusClass = 'warning';
        if (node.actionStatus === 'queued') {
          statusClass = 'dark';
        } else if (node.actionStatus === 'pending') {
          statusClass = 'primary';
        } else if (node.actionStatus === 'complete') {
          statusClass = 'success';
        }
        
        statusBadge.classList.add(`bg-${statusClass}-super-subtle`, `text-${statusClass}`);
        statusBadge.textContent = node.actionStatus;
      }
      
      // Update other UI elements with status classes
      const statusElements = actionCard.querySelectorAll(`[class*="bg-warning"], [class*="bg-primary"], 
                                                       [class*="bg-success"], [class*="text-warning"], 
                                                       [class*="text-primary"], [class*="text-success"]`);
      
      statusElements.forEach(element => {
        const classList = element.className.split(' ');
        const newClassList = [];
        
        let statusClass = 'warning';
        if (node.actionStatus === 'queued') {
          statusClass = 'dark';
        } else if (node.actionStatus === 'pending') {
          statusClass = 'primary';
        } else if (node.actionStatus === 'complete') {
          statusClass = 'success';
        }
        
        for (let i = 0; i < classList.length; i++) {
          const cls = classList[i];
          if (cls.includes('bg-warning') || cls.includes('bg-primary') || 
              cls.includes('bg-success') || cls.includes('bg-dark')) {
            newClassList.push(cls.replace(/(warning|primary|success|dark)/, statusClass));
          } else if (cls.includes('text-warning') || cls.includes('text-primary') || 
                    cls.includes('text-success') || cls.includes('text-dark')) {
            newClassList.push(cls.replace(/(warning|primary|success|dark)/, statusClass));
          } else {
            newClassList.push(cls);
          }
        }
        
        element.className = newClassList.join(' ');
      });
    },
    
    updateNodeStatus: function(node, newStatus) {
      if (!node) return;
      
      const oldStatus = node.actionStatus;
      node.actionStatus = newStatus;
      
      // Update UI
      if (this.rendered && node.elementLi) {
        this.updateNodeStatusUI(node);
      }
      
      // If status changed to complete, update child nodes to open
      if (oldStatus !== 'complete' && newStatus === 'complete') {
        this.updateChildrenToOpen(node);
      } 
      // If status changed from complete to something else, update child nodes to queued
      else if (oldStatus === 'complete' && newStatus !== 'complete') {
        // Check if node has a fluid trigger
        let hasFluidTrigger = false;
        if (node.actionTrigger && node.actionTrigger.triggerType === 'fluid') {
          hasFluidTrigger = true;
        }
        
        if (!hasFluidTrigger) {
          this.updateChildrenToQueued(node);
        }
      }
    },
    
    updateChildrenToOpen: function(node) {
      if (!node.childNodes || node.childNodes.length === 0) return;
      
      for (let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        childNode.actionStatus = 'open';
        
        // Update UI
        if (this.rendered && childNode.elementLi) {
          this.updateNodeStatusUI(childNode);
        }
        
        // Recursively update grandchildren
        this.updateChildrenStatusRecursively(childNode);
      }
    },
    
    updateChildrenToQueued: function(node) {
      if (!node.childNodes || node.childNodes.length === 0) return;
      
      for (let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        childNode.actionStatus = 'queued';
        
        // Update UI
        if (this.rendered && childNode.elementLi) {
          this.updateNodeStatusUI(childNode);
        }
        
        // Recursively update grandchildren
        this.updateChildrenStatusRecursively(childNode);
      }
    },
    
    drawTree: function() {
      this.rendered = true;
      let div_tree = document.getElementById(this.div);
      div_tree.innerHTML = '';
      ulElement = createSimpleElement('ul', this.name, 'tree');
      this.ulElement = ulElement;
      for (let i = 0; i < this.childNodes.length; i++) {
        this.drawNode(ulElement, this.childNodes[i]);
      }
      div_tree.appendChild(ulElement);
      this.adjustLines(document.getElementById(this.name), true);
      
      // Update all action user displays after tree is drawn
      if (window.ActionUsers && typeof window.ActionUsers.refreshAllActionUserDisplays === 'function') {
        // Use setTimeout to ensure DOM is fully rendered before updating
        setTimeout(() => {
          window.ActionUsers.refreshAllActionUserDisplays();
        }, 100);
      }
    },
    drawNode: function(p_ulElement, p_node) {
      v_tree = this;
      let actionStatus = p_node.actionStatus;
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
      let linkedAgendaName = null;
      let linkedAgendaID = null;
      let linkedadgendadisplaystyle = 'none';
      let linkedAgendaHtml = ``;
      let linkedAgendaButton = `
			<a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6" data-action="link-agenda">
			  <i class="ti ti-link-plus text-primary fs-4"></i>
			  <span class="d-none d-md-block font-weight-medium fs-3">Link Agenda</span>
            </a>
			`;
      if (p_node.linkedAgenda != undefined && p_node.linkedAgenda != null && p_node.linkedAgenda.length > 0) {
        // Handle new array format
        const linkedItem = p_node.linkedAgenda[0]; // Get first linked agenda item
        if (linkedItem && linkedItem.id) {
          linkedadgendadisplaystyle = "block";
          linkedAgendaName = `#${linkedItem.index} ${linkedItem.title}`;
          linkedAgendaID = linkedItem.id;
          linkedAgendaHtml = `
				<div class="alert customize-alert alert-dismissible text-${actionStatusClass} border border-${actionStatusClass} fade show remove-close-icon" role="alert">
				<span class="side-line bg-${actionStatusClass}"></span>

				<div class="d-flex align-items-center ">
				  <i class="ti ti-info-circle fs-7 me-2 flex-shrink-0 text-${actionStatusClass} fs-4"></i>
				  <span class="text-truncate">This action is linked to the agenda point: <span class="fs-4 fw-bold"> ${linkedAgendaName}</span></span>
				  <div class="ms-auto d-flex justify-content-end">
					<a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6 disoc" data-action="unLinkAgenda">
					  <i class="ti ti-unlink fs-5 text-warning"></i>
					  Unlink Agenda
					</a>
				  </div>
				</div>
			  </div>
				`;
          linkedAgendaButton = `
				<a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex px-3 gap-6 pulse" data-action="showLinkedAgenda" data-linked-agenda="${linkedAgendaID}">
				  <i class="ti ti-route text-${actionStatusClass} fs-4"></i>
				  <span class="d-none d-md-block font-weight-medium fs-3">Linked Agenda</span>
				  </a>
				`;
        }
      } else if (p_node.linkedAgenda != undefined && p_node.linkedAgenda != null && p_node.linkedAgenda.adcard) {
        // Handle legacy object format for backward compatibility
        linkedadgendadisplaystyle = "block";
        linkedAgendaName = p_node.linkedAgenda.adcardname;
        linkedAgendaID = p_node.linkedAgenda.adcard;
        linkedAgendaHtml = `
				<div class="alert customize-alert alert-dismissible text-${actionStatusClass} border border-${actionStatusClass} fade show remove-close-icon" role="alert">
				<span class="side-line bg-${actionStatusClass}"></span>

				<div class="d-flex align-items-center ">
				  <i class="ti ti-info-circle fs-7 me-2 flex-shrink-0 text-${actionStatusClass} fs-4"></i>
				  <span class="text-truncate">This action is linked to the agenda point: <span class="fs-4 fw-bold"> ${linkedAgendaName}</span></span>
				  <div class="ms-auto d-flex justify-content-end">
					<a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6 disoc" data-action="unLinkAgenda">
					  <i class="ti ti-unlink fs-5 text-warning"></i>
					  Unlink Agenda
					</a>
				  </div>
				</div>
			  </div>
				`;
        linkedAgendaButton = `
				<a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex px-3 gap-6 pulse" data-action="showLinkedAgenda" data-linked-agenda="${linkedAgendaID}">
				  <i class="ti ti-link text-primary fs-4 text-info"></i>
				  <span class="d-none d-md-block font-weight-medium fs-3 text-info">View Linked Agenda</span>
				  </a>
				`;
      }
      //setting up the action type
      let actionTypeHtml = `<h6 class="mt-3 text-muted fw-normal">What type of action is this?</h6>
			  <div class="btn-group">
				<button class="btn btn-dark meenoe-action-select dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
			  </div>`;
      let actionIcon = ``;
      let actionDescription = ``;
      let actionDate = p_node.actionDate;

      if (p_node.actionType != undefined && p_node.actionType != null) {
        if (p_node.actionType === "Approvals") {
          actionIcon = "ti-square-check";
          actionDescription = "Approvals are crucial for ensuring that decisions are made collectively and with full understanding of the implications.\nThis process involves reviewing and approving documents or proposals.";
        } else if (p_node.actionType === "Surveys") {
          actionIcon = "ti-help-hexagon";
          actionDescription = "Surveys are essential for gathering feedback and insights from various stakeholders.\nThey help in understanding the needs, preferences, and opinions of the participants.";
        } else if (p_node.actionType === "Signing") {
          actionIcon = "ti-signature";
          actionDescription = "Signing is a formal way of agreeing to terms or conditions.\nIt's often used in legal documents, contracts, or agreements to validate the consent of the parties involved.";
        } else if (p_node.actionType === "Project") {
          actionIcon = "ti-layout-kanban";
          actionDescription = "Projects are structured efforts to create a product, service, or result.\nThey involve planning, execution, and monitoring to achieve specific goals within a defined timeframe.";
        } else if (p_node.actionType === "Voting") {
          actionIcon = "ti-ballpen";
          actionDescription = "Voting is a democratic process where individuals express their preferences for a particular choice.\nIt's used in decision-making processes to select options based on majority or consensus.";
        } else if (p_node.actionType === "Tasklist") {
          actionIcon = "ti-checklist";
          actionDescription = "Tasklists are lists of tasks or activities that need to be completed.\nThey help in organizing work, tracking progress, and ensuring that all necessary steps are taken.";
        } else if (p_node.actionType === "Brainstorming") {
          actionIcon = "ti-grain";
          actionDescription = "Brainstorming is a creative process to generate ideas and solutions.\nIt involves free thinking and discussion to explore various possibilities and innovations.";
        } else if (p_node.actionType === "Documentation") {
          actionIcon = "ti-file-description";
          actionDescription = "Documentation is the process of creating and maintaining records of information.\nIt's crucial for preserving knowledge, facilitating communication, and ensuring accountability.";
        } else if (p_node.actionType === "Policies") {
          actionIcon = "ti-notebook";
          actionDescription = "Policies are rules or guidelines established by an organization to govern its operations.\nThey help in maintaining standards, ensuring consistency, and promoting ethical behavior.";
        } else if (p_node.actionType === "Discussion") {
          actionIcon = "ti-message-plus";
          actionDescription = "Discussion is a process of exchanging ideas and information among individuals or groups.\nIt's essential for problem-solving, decision-making, and fostering collaboration.";
        } else if (p_node.actionType === "Resource Allocation") {
          actionIcon = "ti-target";
          actionDescription = "Resource allocation is the process of distributing resources among various activities or projects.\nIt involves planning and managing resources efficiently to achieve optimal outcomes.";
        } else if (p_node.actionType === "Reviews") {
          actionIcon = "ti-text-scan-2";
          actionDescription = "Reviews are processes of examining and evaluating work or materials.\nThey help in identifying strengths, weaknesses, and areas for improvement.";
        } else if (p_node.actionType === "Feedback") {
          actionIcon = "ti-message-forward";
          actionDescription = "Feedback is information provided by an individual or group about the performance or quality of a product, service, or process.\nIt's crucial for continuous improvement and learning.";
        } else if (p_node.actionType === "Assessments") {
          actionIcon = "ti-square-rounded-check";
          actionDescription = "Assessments are evaluations of an individual's or group's knowledge, skills, or abilities.\nThey help in determining the level of competence and identifying areas for development.";
        } else if (p_node.actionType === "Problem Solving") {
          actionIcon = "ti-mood-check";
          actionDescription = "Problem solving is the process of finding solutions to problems or challenges.\nIt involves identifying issues, analyzing them, and implementing effective strategies to overcome obstacles.";
        } else if (p_node.actionType === "File Uploads") {
          actionIcon = "ti-upload";
          actionDescription = "File uploads are the process of transferring files from a local computer to a server or cloud storage.\nIt's essential for sharing documents, images, and other files with others.";
        } else if (p_node.actionType === "Video") {
          actionIcon = "ti-video";
          actionDescription = "Video is a medium used for communication, entertainment, education, and various other purposes. Quickly share your video recorded ideas, thoughts or information without needing to type.";
        } else if (p_node.actionType === "Audio") {
          actionIcon = "ti-microphone";
          actionDescription = "Communicate your thoughts, ideas, and details through voice recorded messages in a quick and effective manner without needing to type.";
        } else if (p_node.actionType === "Presentation") {
          actionIcon = "ti-presentation";
          actionDescription = "Presentations are formal or informal speeches or displays of information.\nThey are used to convey ideas, information, or arguments to an audience.";
        } else if (p_node.actionType === "Integrations") {
          actionIcon = "ti-arrow-iteration";
          actionDescription = "Integrations are the process of combining different systems or applications to work together seamlessly.\nIt's crucial for enhancing functionality, improving efficiency, and achieving synergy.";
        } else if (p_node.actionType === "Custom Action") {
          actionIcon = "ti-adjustments-check";
          actionDescription = "Custom actions provide a versatile way to manage various aspects of your life. Simply define the specific action and the associated goal you aim to achieve, then manually track your progress towards it. This way, you can stay organized and focused on your objectives.";
        }
        actionTypeHtml = `
				<div class="d-flex align-items-center gap-3">
				  <div class="meenoe-action-info-icon p-6 bg-${actionStatusClass}-super-subtle rounded d-flex align-items-center justify-content-center">
					<i class="ti ${actionIcon} text-${actionStatusClass} fs-6"></i>
				  </div>
				  <div>
					<h6 class="meenoe_action_type fs-4 fw-semibold">${p_node.actionType}</h6>
					<div class="meenoe-action-date fs-2 text-muted">${actionDate}</div>
				  </div>
				  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-info ms-auto disoc">
					<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
				  </button>
				</div>
				<h6 class="meenoe_action_description text-muted fw-normal mt-2">${actionDescription}</h6>
			`;
      }

      //setting the action trigger
      let actionTriggerHtml = `
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
      if (p_node.actionTrigger != undefined || p_node.actionTrigger != null) {
        if (p_node.actionTrigger.triggerType === "fluid") {
          actionTriggerHtml = `
					<div class="d-flex align-items-center justify-content-between mb-1">
					  <div class="d-flex">
						<div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
						  <i class="ti ti-ripple me-2"></i>
						  This action is always open, and never closes.
						</div>
					  </div>
					  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
						<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
					  </button>
					</div>
				  `;
        } else if (p_node.actionTrigger.triggerType === "deadline") {
          actionTriggerHtml = `
                          <div class="d-flex align-items-center justify-content-between mb-1">
                              <div class="d-flex">
                                  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                                      <i class="ti ti-clock-hour-9 me-2"></i>
                                      The deadline for this action is ${p_node.actionTrigger.triggerDate}
                                  </div>
                              </div>
                              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc" aria-label="Edit deadline">
                                  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                              </button>
                          </div>`;
        } else if (p_node.actionTrigger.triggerType === "due date") {
          actionTriggerHtml = `
                          <div class="d-flex align-items-center justify-content-between mb-1">
                  <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                      <i class="ti ti-clock-hour-7 me-2"></i>
                      This action is due on or before ${p_node.actionTrigger.triggerDate}
                    </div>
                  </div>
                  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                  </button>
                </div>`;
        } else if (p_node.actionTrigger.triggerType === "available until") {
          actionTriggerHtml = `
                          <div class="d-flex align-items-center justify-content-between mb-1">
                  <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                      <i class="ti ti-clock-hour-7 me-2"></i>
                      This action will be available until ${p_node.actionTrigger.triggerDate}
                    </div>
                  </div>
                  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                  </button>
                </div>`;
        } else if (p_node.actionTrigger.triggerType === "conditional") {
          actionTriggerHtml = `
                          <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                    <i class="ti ti-progress-check me-2"></i>
                    This action will be considered complete once the progress surpasses or is at <strong>${p_node.actionTrigger.conditionPercent}</strong>%
                  </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
              </div>`;
        } else if (p_node.actionTrigger.triggerType === "approval") {
          if (p_node.actionTrigger.approved === false) {
            actionTriggerHtml = `
                <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex">
                <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                  <i class="ti ti-file-like me-2"></i>
                  This action is pending approval and has not yet been approved.
                </div>
              </div>
              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
              </button>
            </div>`;
          } else {
            actionTriggerHtml = `
                <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex">
                <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                  <i class="ti ti-file-like me-2"></i>
                  This action has been approved.
                </div>
              </div>
              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
              </button>
            </div>`;
          }
        } else if (p_node.actionTrigger.triggerType === "recurring") {
          actionTriggerHtml = `
                <div class="d-flex align-items-center justify-content-between mb-1">
						<div class="d-flex">
						  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
							<i class="ti ti-calendar me-2"></i>
							This is a recurring action which happens once ${p_node.actionTrigger.frequency}. The next occurrence is scheduled for ${p_node.actionTrigger.triggerDate}
						  </div>
						</div>
						<button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
						  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
						</button>
					  </div>`;
        }
      }
      let v_icon = null;
      if (p_node.icon != null)
        v_icon = createchildToggleElement(null, 'icon_tree', p_node.icon);
      let v_li = document.createElement('li');
      p_node.elementLi = v_li;
      let v_span = createSimpleElement('span', null, 'node');
      let v_exp_col = null;
      if (p_node.childNodes.length == 0) {
        v_exp_col = createSimpleElement('meenoe-exp', 'toggle_off', 'exp_col');
        v_exp_col.innerHTML = rootSVG;
        v_exp_col.style.visibility = "visible";
      } else {
        if (p_node.expanded) {
          v_exp_col = createSimpleElement('meenoe-exp', 'toggle_off', 'exp_col');
          v_exp_col.innerHTML = collapseSvg;
          v_exp_col.style.visibility = "visible";
        } else {
          v_exp_col = createSimpleElement('meenoe-exp', 'toggle_on', 'exp_col');
          v_exp_col.innerHTML = expandSvg;
          v_exp_col.style.visibility = "visible";
        }
      }
      v_span.ondblclick = function() {
        v_tree.doubleClickNode(p_node);
      };
      v_exp_col.onclick = function() {
        v_tree.toggleNode(p_node);
      };
      v_span.onclick = function() {
        v_tree.selectNode(p_node);
      };
      if (v_icon != undefined)
        v_span.appendChild(v_icon);
      let v_card;
      let actionID = p_node.id;
      v_card = createSimpleElement('div', null, 'meenoe-action-card card rounded');
      v_card.id = actionID;
      
      // Add a visible placeholder to ensure the users section appears
      let actionusershtml = `<div class="text-muted small">Loading users...</div>`;
      
      let actionbadgeClass = 'badge fw-semibold py-1 w-85 bg-primary-subtle text-primary ms-3';
      let actionbadgeText = 'open';
      v_card.innerHTML = `
		  <div class="card-header text-bg-white d-flex align-items-center">
			    <span class="side-stick bg-${actionStatusClass}"></span>
                <div class="card-actions cursor-pointer me-auto d-flex button-group">
                  <a href="javascript:void(0)" class="mb-0 btn-drag pe-sm-2 cursor-pointer link d-flex align-items-center disoc" data-action="drag">
                    <i class="ti ti-grip-vertical fs-6 text-dark"></i>
                  </a>
                  <h4 class="card-title mb-0 meenoe-action-title meenoe-ed-title">${p_node.actionTitle}</h4>
				  <span class="badge fw-semibold py-1 w-85 bg-${actionStatusClass}-super-subtle text-${actionStatusClass} ms-3">${actionStatus}</span>
                </div>
                <div class="card-actions cursor-pointer ms-auto d-flex button-group">
				  <!-- action buttons -->
				  <a class="me-3 cursor-pointer d-flex align-items-center gap-1" href="javascript:void(0);" data-action="collapse">
						<i class="ti ti-minus fs-5 text-dark"></i>
				  </a>
				  <div class="dropdown">
					<a class="fs-6 text-primary" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false"  data-bs-popper-config='{"strategy":"fixed"}'>
					  <i class="ti ti-dots-vertical text-dark"></i>
					</a>
					<div class="dropdown-menu dropdown-menu-end" style="">
					  <a class="dropdown-item cursor-pointer d-flex align-items-center gap-1" href="javascript:void(0);" data-action="show-connected-action">
						<i class="ti ti-caret-down fs-5"></i>Show Connected Actions
					  </a>
					  <a class="dropdown-item cursor-pointer d-flex align-items-center gap-1" href="javascript:void(0);" data-action="hide-connected-action">
						<i class="ti ti-caret-right fs-5"></i>Hide Connected Actions
					  </a>
					  <a class="dropdown-item cursor-pointer d-flex align-items-center gap-1 disoc" href="javascript:void(0);" data-action="create-child-action">
						<i class="ti ti-crosshair fs-5"></i>Create Connected Action
					  </a>
					  <a class="dropdown-item cursor-pointer d-flex align-items-center gap-1 text-danger disoc" href="javascript:void(0);" data-action="close-meenoe-card">
						<i class="ti ti-trash-x fs-5 text-danger"></i>Delete Action
					  </a>
					</div>
				  </div>
                </div>
              </div>
              <div class="card-body collapse show pt-1" style="">
				<div class="my-md-4 linked-agenda-notice" style="display: ${linkedadgendadisplaystyle};">
				${linkedAgendaHtml}
				</div>
                <div class="my-md-4 action-selector" style="display: block">
                  ${actionTypeHtml}
                </div>
                <div class="my-md-4 meenoe-action-trigger">
					${actionTriggerHtml}
                </div>
                <div class="action-card-users avatar-stack my-md-3">
                  ${actionusershtml}
                </div>
                <div class="action-progress mt-4">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="action-progress-title">Progress</h6>
                    <div>
					  <span class="badge progress-perc-num bg-${actionStatusClass}-subtle text-${actionStatusClass} fw-semibold fs-3">${p_node.progressNumber}</span>
					</div>
                  </div>
                  <div class="progress">
                    <div class="progress-bar text-bg-${actionStatusClass}" role="progressbar" style="width: ${p_node.progressNumber}%;" aria-valuenow="${p_node.progressNumber}" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
                <div class="button-group d-flex align-content-md-between justify-content-between mt-4">
                  <a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6 me-3" data-action="open-action">
                  <i class="ti ti-pointer-share text-primary fs-4"></i>
                  <span class="d-none d-md-block font-weight-medium fs-3">Open Action</span>
                  </a>
                  <a href="javascript:void(0)" class="btn btn-light align-items-center meenoe-shadow d-flex align-items-center px-3 gap-6 me-3 disoc" data-action="create-child-action">
                  <i class="ti ti-crosshair text-primary fs-4"></i>
                  <span class="d-none d-md-block font-weight-medium fs-3">Create Connected Action</span>
                  </a>
                  ${linkedAgendaButton}
                </div>
              </div>
		`;
      v_span.appendChild(v_card);
      v_card.addEventListener('click', function(e) {
        if (e.target.matches('.context-menu-button')) {
          v_tree.selectNode(p_node);
          v_tree.nodeContextMenu(e, p_node);
        }
        if (e.target.matches('[data-action="close-meenoe-card"]') ) {
          p_node.removeNode();
          tree.updateListClasses();
        }
        if (e.target.matches('[data-action="delete-children-actions"]')) {
          p_node.removeChildNodes();
          tree.updateListClasses();
        }
        if (e.target.matches('[data-action="hide-connected-action"]')) {
          p_node.collapseNode();
          tree.updateListClasses();
        }
        if (e.target.matches('[data-action="show-connected-action"]')) {
          p_node.expandNode();
          tree.updateListClasses();
        }
        if (e.target.matches('[data-action="create-child-action"]')) {
          p_node.createChildNode('New action', false, null, null, 'context1');
          tree.updateListClasses();
        }
      });
      v_li.appendChild(v_exp_col);
      v_li.appendChild(v_span);
      if (p_node.parent == null || p_node.parent == this) {
        v_li.classList.add('meenoe-root-li');
      } else {
        v_li.classList.add('meenoe-child-li');
      }
      p_ulElement.appendChild(v_li);
      let v_ul = createSimpleElement('ul', 'ul_' + p_node.id, null);
      v_li.appendChild(v_ul);
      if (p_node.childNodes.length > 0) {
        if (!p_node.expanded)
          v_ul.style.display = 'none';
        for (let i = 0; i < p_node.childNodes.length; i++) {
          this.drawNode(v_ul, p_node.childNodes[i]);
        }
      }
      let sortable = new Sortable(v_ul, {
        group: 'tree',
        animation: 150,
        handle: '.btn-drag',
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onUpdate: function(evt) {},
        onMove: function(evt) {},
        onEnd: function(evt) {
          tree.updateListClasses();
          //push to the meenoe state
          tree.serializeActions(tree);
        }
      });
      //console.log(tree);
      customSmoothScrollTo(v_card);
      
      // Update the user display dynamically after the card is created
      if (window.ActionUsers && typeof window.ActionUsers.updateSpecificActionDisplay === 'function') {
        // Use setTimeout to ensure DOM is fully ready
        setTimeout(() => {
          window.ActionUsers.updateSpecificActionDisplay(p_node.id);
        }, 200);
      }
      
      //push to the meenoe state
      this.serializeActions(tree);
    },
    updateListClasses: function() {
      let tree = this.ulElement;
      let lists = [];
      if (tree.childNodes.length > 0) {
        lists = [tree];
        for (let i = 0; i < tree.getElementsByTagName("ul").length; i++) {
          let check_ul = tree.getElementsByTagName("ul")[i];
          if (check_ul.childNodes.length != 0)
            lists[lists.length] = check_ul;
        }
      }
      for (let i = 0; i < lists.length; i++) {
        let lastItem = lists[i].lastChild;
        while (!lastItem.tagName || lastItem.tagName.toLowerCase() != "li") {
          lastItem = lastItem.previousSibling;
        }
        if (lastItem.classList.contains('meenoe-child-li')) {
          lastItem.classList.remove('meenoe-child-li');
          lastItem.classList.add('meenoe-child-last');
        }
        let currentItem = lastItem.previousSibling;
        while (currentItem) {
          if (currentItem.tagName.toLowerCase() == "li" && !currentItem.classList.contains('meenoe-root-li')) {
            currentItem.classList.remove('meenoe-child-last');
            currentItem.classList.add('meenoe-child-li');
          }
          currentItem = currentItem.previousSibling;
        }
      }
      //push to the meenoe state
      this.serializeActions(v_tree);
    },
    setText: function(p_node, p_text) {
      p_node.elementLi.getElementsByTagName('span')[0].lastChild.innerHTML = p_text;
      p_node.text = p_text;
    },
    expandTree: function() {
      for (let i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].childNodes.length > 0) {
          this.expandSubtree(this.childNodes[i]);
        }
      }
    },
    expandSubtree: function(p_node) {
      this.expandNode(p_node);
      for (let i = 0; i < p_node.childNodes.length; i++) {
        if (p_node.childNodes[i].childNodes.length > 0) {
          this.expandSubtree(p_node.childNodes[i]);
        }
      }
    },
    collapseTree: function() {
      for (let i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].childNodes.length > 0) {
          this.collapseSubtree(this.childNodes[i]);
        }
      }
    },
    collapseSubtree: function(p_node) {
      this.collapseNode(p_node);
      for (let i = 0; i < p_node.childNodes.length; i++) {
        if (p_node.childNodes[i].childNodes.length > 0) {
          this.collapseSubtree(p_node.childNodes[i]);
        }
      }
    },
    expandNode: function(p_node) {
      if (p_node.childNodes.length > 0 && p_node.expanded == false) {
        if (this.nodeBeforeOpenEvent != undefined)
          this.nodeBeforeOpenEvent(p_node);
        let childToggle = p_node.elementLi.getElementsByTagName("meenoe-exp")[0];
        p_node.expanded = true;
        childToggle.id = "toggle_off";
        childToggle.innerHTML = collapseSvg;
        childToggle.style.visibility = 'visible';
        elem_ul = childToggle.parentElement.getElementsByTagName("ul")[0];
        elem_ul.style.display = 'block';
        if (this.nodeAfterOpenEvent != undefined)
          this.nodeAfterOpenEvent(p_node);
      }
    },
    collapseNode: function(p_node) {
      console.log(p_node);
      if (p_node.childNodes.length > 0 && p_node.expanded == true) {
        let childToggle = p_node.elementLi.getElementsByTagName("meenoe-exp")[0];
        p_node.expanded = false;
        if (this.nodeBeforeCloseEvent != undefined)
          this.nodeBeforeCloseEvent(p_node);
        childToggle.id = "toggle_on";
        childToggle.innerHTML = expandSvg;
        elem_ul = childToggle.parentElement.getElementsByTagName("ul")[0];
        elem_ul.style.display = 'none';
      }
    },
    toggleNode: function(p_node) {
      if (p_node.childNodes.length > 0) {
        if (p_node.expanded)
          p_node.collapseNode();
        else
          p_node.expandNode();
      }
    },
    doubleClickNode: function(p_node) {
      this.toggleNode(p_node);
    },
    generateUniqueId: function() {
      let date = new Date();
      let timestamp = date.getTime().toString();
      let randomString = Math.random().toString(36).substr(2, 8);
      d = timestamp + randomString;
      return uniqueId;
    },
    selectNode: function(p_node) {
      let span = p_node.elementLi.getElementsByTagName("span")[0];
      span.classList.add('node_selected');
      if (this.selectedNode != null && this.selectedNode != p_node)
        this.selectedNode.elementLi.getElementsByTagName("span")[0].className = 'node';
      this.selectedNode = p_node;
      //tree.updateNodeByID(p_node.id);
      return p_node.id;
    },
    updateNodeByID: function(node_ID, node = tree) {
      if (node.id === node_ID) {
        console.log(node);
        node.elementLi.childNodes[1].childNodes[0].innerHTML = `TESTING THIS`;
        return node;
      }
      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          let result = this.updateNodeByID(node_ID, node.childNodes[i]);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    removeNode: function(p_node) {
      if (p_node.parent === null) {
        p_node.parent = tree.findParent(tree, p_node);
      } else if (!Array.isArray(p_node.parent)) {
        p_node.parent = tree.findParent(tree, p_node);
      }
      // Show the confirmation modal
      var confirmationModal = new bootstrap.Modal(document.getElementById('confirmDeleteActionModal'));
      confirmationModal.show();
      // Handle the 'Delete' button click
      document.getElementById('confirmDeleteAction').addEventListener('click', function() {
        console.log(p_node.parent);
        let index = p_node.parent.childNodes.indexOf(p_node);
        if (p_node.elementLi.className == "last" && index != 0) {
          p_node.parent.childNodes[index - 1].elementLi.className += "last";
          p_node.parent.childNodes[index - 1].elementLi.style.backgroundColor = this.backcolor;
        }
        p_node.elementLi.parentNode.removeChild(p_node.elementLi);
        p_node.parent.childNodes.splice(index, 1);
        // Hide the modal
        confirmationModal.hide();
        if (p_node.parent.childNodes.length == 0 && tree.childNodes.length != 0) {
          let v_childToggle = p_node.parent.elementLi.querySelector('.exp_col');
          console.log(p_node.parent.elementLi.childNodes[1]);
          v_childToggle.innerHTML = rootSVG;
          v_childToggle.style.visibility = "visible";
        }
      });
    },
    removeNode1: function(p_node) {
      if (p_node.parent === null) {
        p_node.parent = tree.findParent(tree, p_node);
      } else if (!Array.isArray(p_node.parent)) {
        p_node.parent = tree.findParent(tree, p_node);
      }
      let index = p_node.parent.childNodes.indexOf(p_node);
      if (p_node.elementLi.className == "last" && index != 0) {
        p_node.parent.childNodes[index - 1].elementLi.className += "last";
        p_node.parent.childNodes[index - 1].elementLi.style.backgroundColor = this.backcolor;
      }
      p_node.elementLi.parentNode.removeChild(p_node.elementLi);
      p_node.parent.childNodes.splice(index, 1);
      if (p_node.parent.childNodes.length == 0 && tree.childNodes.length != 0) {
        let v_childToggle = p_node.parent.elementLi.querySelector('.exp_col');
        console.log(p_node.parent.elementLi.childNodes[1]);
        v_childToggle.innerHTML = rootSVG;
        v_childToggle.style.visibility = "visible";
      }
    },
    findParent: function(tree, targetNode) {
      function traverse(node, parent) {
        if (!node) return null;
        // If the current node is the target node, return the parent
        if (node === targetNode) {
          return parent;
        }
        // Traverse through child nodes
        for (let child of node.childNodes) {
          let result = traverse(child, node);
          if (result) {
            return result;
          }
        }
        return null;
      }
      // Start traversal from the root node
      return traverse(tree, null);
    },
    removeChildNodes: function(p_node) {
      if (p_node.childNodes.length > 0) {
        let v_ul = p_node.elementLi.getElementsByTagName("ul")[0];
        let v_childToggle = p_node.elementLi.getElementsByTagName("childToggle")[0];
        v_childToggle.innerHTML = rootSVG;
        v_childToggle.style.visibility = "visible";
        p_node.childNodes = [];
        v_ul.innerHTML = "";
      }
    },
    // Set node name 
    setName: function(actionID, name) {
      if (node.id === actionID) {
        node.name = name;
      }
    },
    diffActions: function(oldState, newState) {
      oldState = decompressJsonArray(oldState);
      newState = decompressJsonArray(newState);
      const oldItemsById = {};
      const newItemsById = {};
      const diffs = {
        added: [],
        removed: [],
        modified: []
      };
      // Create dictionaries of old and new items by their IDs
      oldState.forEach(item => {
        oldItemsById[item.id] = item;
      });
      newState.forEach(item => {
        newItemsById[item.id] = item;
      });
      // Check for removed and modified items
      oldState.forEach(oldItem => {
        if (!newItemsById[oldItem.id]) {
          // Item was removed
          diffs.removed.push(oldItem);
        } else {
          // Check for modifications
          const newItem = newItemsById[oldItem.id];
          const changes = getChanges(oldItem, newItem);
          if (Object.keys(changes).length > 0) {
            diffs.modified.push({
              id: oldItem.id,
              changes
            });
          }
        }
      });
      // Check for added items
      newState.forEach(newItem => {
        if (!oldItemsById[newItem.id]) {
          diffs.added.push(newItem);
        }
      });
      tree.updateFromDiff(diffs);
      return diffs;
    },
    updateFromDiff: function(diffs) {
      diffs.removed.forEach(removedItem => {
        const nodeFound = this.findNodeByID(removedItem.id);
        if (nodeFound) {
          nodeFound.removeNode1();
        }
      });
      let nodeMap = {};

      function createNodeFromJson(jsonNode) {
        const node = {
          id: jsonNode.id,
          actionStatus: jsonNode.actionStatus,
          parent: jsonNode.parent ? jsonNode.parent.id : null,
          expanded: jsonNode.expanded,
          childNodes: [],
          tag: jsonNode.tag,
          actionTitle: jsonNode.actionTitle,
          actionType: jsonNode.actionType,
          actionDate: jsonNode.actionDate,
          actionTrigger: jsonNode.actionTrigger,
          actionUsers: jsonNode.actionUsers,
          linkedAgenda: jsonNode.linkedAgenda,
          progressNumber: jsonNode.progressNumber,
          removeNode: function() {
            v_tree.removeNode(this);
          },
          removeNode1: function() {
            v_tree.removeNode1(this);
          },
          toggleNode: function(p_event) {
            v_tree.toggleNode(this);
          },
          expandNode: function(p_event) {
            v_tree.expandNode(this);
          },
          expandSubtree: function() {
            v_tree.expandSubtree(this);
          },
          setText: function(p_text) {
            v_tree.setText(this, p_text);
          },
          collapseNode: function() {
            v_tree.collapseNode(this);
          },
          collapseSubtree: function() {
            v_tree.collapseSubtree(this);
          },
          removeChildNodes: function() {
            v_tree.removeChildNodes(this);
          },
          createChildNode: function(p_text, p_expanded, p_icon, p_tag, p_contextmenu) {
            let childNode = v_tree.createNode(p_text, p_expanded, p_icon, this, p_tag, p_contextmenu);
            v_tree.expandNode(this);
            customSmoothScrollTo(childNode.elementLi);
            return childNode;
          }
        };
        if (jsonNode.childNodes.length > 0) {
          jsonNode.childNodes.forEach((childJsonNode) => {
            const childNode = createNodeFromJson(childJsonNode);
            node.childNodes.push(childNode);
            childNode.parent = node.id;
          });
        }
        return node;
      }
      diffs.added.forEach((jsonNode) => {
        let node = createNodeFromJson(jsonNode);
        console.log(node);
        tree.childNodes.push(node);
        tree.drawNode(tree.ulElement, node);
        tree.updateListClasses();
        return tree;
      });
      const updateCard = (card, changes, item) => {
        Object.entries(changes).forEach(([changeKey, change]) => {
          if (changeKey === 'actionTitle') {
            const titleElement = card.querySelector('.meenoe-ed-title');
            if (titleElement) {
              titleElement.innerText = change.new;
            }
          } else if (changeKey === 'childNodes') {
            console.log(change);
            change.new.forEach((jsonNode) => {
              //jsonNode = change.new;
              const parentNode = tree.findNodeByID(jsonNode.parent);
              let node = createNodeFromJson(jsonNode);
              if (parentNode != null) {
                let parentUL = parentNode.elementLi.getElementsByTagName("ul")[0];
                let currentNode = tree.findNodeByID(jsonNode.id);
                if (currentNode != null) {
                  tree.removeNode1(currentNode);
                }
                node.parent = parentNode;
                parentNode.childNodes.push(node);
                tree.drawNode(parentUL, node);
                tree.updateListClasses();
                console.log(parentNode);
                let childToggle = parentNode.elementLi.querySelector(".exp_col");
                childToggle.id = "toggle_off";
                childToggle.innerHTML = collapseSvg;
                childToggle.querySelector('svg').innerHTML = collapseSvg;
                childToggle.style.visibility = 'visible';
                tree.expandNode(parentNode);
                console.log(tree.childNodes);
                return tree;
              }
            });
          } else if (changeKey === 'expanded') {
            const actionNode = this.findNodeByID(item.id);
            if (change.new == true) {
              tree.expandNode(actionNode);
              let childToggle = actionNode.elementLi.querySelector(".exp_col");
              actionNode.expanded = true;
              childToggle.id = "toggle_off";
              childToggle.innerHTML = collapseSvg;
              childToggle.querySelector('svg').innerHTML = collapseSvg;
              childToggle.style.visibility = 'visible';
            } else {
              tree.collapseNode(actionNode);
            }
          } else if (changeKey === 'actionStatus') {
            const statusElement = card.querySelector('.status-element');
            if (statusElement) {
              statusElement.innerText = change.new;
            }
            node.actionStatus = change.new;
          }
        });
      };
      diffs.modified.forEach(modifiedItem => {
        let card = document.querySelector(`#${modifiedItem.id}`);
        if (card) {
          updateCard(card, modifiedItem.changes, modifiedItem);
        }
      });
    },
    findNodeByID: function(id, node = this) {
      if (node.id === id) {
        return node;
      }
      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          let result = this.findNodeByID(id, node.childNodes[i]);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },

// diff single node and find differences
diffNodeByID: function(newNode) {
  // Decompress the new node array and retrieve the corresponding old node
  newNode = decompressJsonArray(newNode);
  let oldNode = tree.findNodeByID(newNode[0].id);

  const serializedOldNode = {
    id: oldNode.id ?? null,
    actionStatus: oldNode.actionStatus ?? null,
    parent: oldNode.parent?.id ?? null,
    expanded: oldNode.expanded ?? null,
    childNodes: oldNode.childNodes ?? [],
    tag: oldNode.tag ?? null,
    actionTitle: oldNode.actionTitle ?? null,
    actionType: oldNode.actionType ?? null,
    actionDate: oldNode.actionDate ?? null,
    actionTrigger: oldNode.actionTrigger ?? null,
    actionUsers: oldNode.actionUsers ?? null,
    linkedAgenda: oldNode.linkedAgenda ?? null,
    progressNumber: oldNode.progressNumber,
  };

  let changes = {};

  // Helper function to recursively detect differences
  function diffProperties(oldObj, newObj, changesObj, path = '') {
    for (let key in newObj) {
      let oldVal = oldObj[key];
      let newVal = newObj[key];

      // Recursive comparison for objects
      if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
        if (!changesObj[key]) changesObj[key] = {};
        diffProperties(oldVal || {}, newVal, changesObj[key], path + key + '.');
        if (Object.keys(changesObj[key]).length === 0) {
          delete changesObj[key];
        }
      } else if (Array.isArray(newVal)) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          changesObj[key] = newVal;
        }
      } else if (newVal !== oldVal) {
        changesObj[key] = newVal;
      }
    }
  }

  diffProperties(serializedOldNode, newNode[0], changes);

  // Apply changes to DOM and update oldNode values
  function applyChangesToDOMAndOldNode(changes, oldNode, newNode) {
  	console.log(oldNode);
  	console.log(newNode);
  	let card = oldNode.elementLi.querySelector('.meenoe-action-card');

    for (let key in changes) {
      switch (key) {
        case 'actionTitle':
          oldNode.elementLi.querySelector('.meenoe-action-title').textContent = newNode[0].actionTitle;
          oldNode.actionTitle = newNode[0].actionTitle;
          break;
        
        case 'actionType':
        	//action html changes 
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
					  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-info ms-auto disoc">
						<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
					  </button>
					</div>
					<h6 class="meenoe_action_description text-muted fw-normal mt-2">
					  
					</h6>
					`;

	        // Update the "meenoe-action-type" h6
	        let actionType = newNode[0].actionType;

	        // Update the "meenoe-action-info-icon" i element class
	        let actionIcon = actionSelect.querySelector('.meenoe-action-info-icon');
	        let actionI = actionSelect.querySelector('.meenoe-action-info-icon i');
	        if (actionIcon) {
	          // Add the class of the clicked item's icon
	          let clickedIconClass = e.target.querySelector('i').className;
	          console.log(clickedIconClass);
	          actionI.className = clickedIconClass;
	          actionI.classList.remove("me-2");
	          actionI.classList.add('text-' + actionStatusClass, 'fs-6');
	        }

	        // Set the "meenoe-action-date" p to the current date
	        let actionDate = actionSelect.querySelector('.meenoe-action-date');
	        if (actionDate) {
	          actionDate.textContent = newNode[0].actionDate;
	          oldNode.actionDate = newNode[0].actionDate;;
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
	        let actiondesct = actionType;
	        if (actionDescriptions.hasOwnProperty(actiondesct)) {
	          // Update the innerText of the "actionDesc" element with the description
	          actionDesc.innerText = actionDescriptions[actiondesct];
	        } else {
	          // If the actionType is not found, you might want to handle this case, e.g., by setting a default description
	          actionDesc.innerText = "No description available for this action type.";
	        }
	        //push to the meenoe state
	        //tree.serializeActions(tree);
        	//end
          oldNode.actionType = newNode[0].actionType;
          break;
        
        case 'actionDate':
          //document.getElementById(oldNode.id).querySelector('.action-date').textContent = newNode[0].actionDate;
          oldNode.actionDate = newNode[0].actionDate;
          break;
        
        case 'actionStatus':
          document.getElementById(oldNode.id).querySelector('.action-status').textContent = newNode[0].actionStatus;
          oldNode.actionStatus = newNode[0].actionStatus;
          break;
        
        case 'actionTrigger':
          let triggerSelector = card.querySelector('.meenoe-action-trigger');
          let actionStatus = oldNode.actionStatus;
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

			    if (newNode[0].actionTrigger.triggerType === "fluid") {
			    	triggerSelector.innerHTML = `
						<div class="d-flex align-items-center justify-content-between mb-1">
						  <div class="d-flex">
							<div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
							  <i class="ti ti-ripple me-2"></i>
							  This action is always open, and never closes.
							</div>
						  </div>
						  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
							<i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
						  </button>
						</div>
					  `;
			    }
			    else if (newNode[0].actionTrigger.triggerType === "deadline") {
			    	triggerSelector.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                        <i class="ti ti-clock-hour-9 me-2"></i>
                        The deadline for this action is ${newNode[0].actionTrigger.triggerDate}
                    </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc" aria-label="Edit deadline">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
            </div>`;
			    }
			    else if (newNode[0].actionTrigger.triggerType === "due date") {
			    	triggerSelector.innerHTML = `
              <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                    <i class="ti ti-clock-hour-7 me-2"></i>
                    This action is due on or before ${newNode[0].actionTrigger.triggerDate}
                  </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
              </div> 
            `;
			    }
			    else if (newNode[0].actionTrigger.triggerType === "available until") {
			    	triggerSelector.innerHTML = `
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <div class="d-flex">
                    <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                      <i class="ti ti-clock-hour-7 me-2"></i>
                      This action will be available until ${newNode[0].actionTrigger.triggerDate}
                    </div>
                  </div>
                  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                  </button>
                </div>  
              `;
			    }
			    else if (newNode[0].actionTrigger.triggerType === "conditional") {
			    	triggerSelector.innerHTML = `
              <div class="d-flex align-items-center justify-content-between mb-1">
                <div class="d-flex">
                  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
                    <i class="ti ti-progress-check me-2"></i>
                    This action will be considered complete once the progress surpasses or is at <strong>${newNode[0].actionTrigger.conditionPercent}</strong>%
                  </div>
                </div>
                <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
                  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
                </button>
              </div>
            `;
			    }
			    else if (newNode[0].actionTrigger.triggerType === "approval") {
			    	if(newNode[0].actionTrigger.approved === false) {
				    	triggerSelector.innerHTML = `
	            <div class="d-flex align-items-center justify-content-between mb-1">
	              <div class="d-flex">
	                <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
	                  <i class="ti ti-file-like me-2"></i>
	                  This action is pending approval and has not yet been approved.
	                </div>
	              </div>
	              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
	                <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
	              </button>
	            </div>
	          `;
				  } else {
				  	triggerSelector.innerHTML = `
	            <div class="d-flex align-items-center justify-content-between mb-1">
	              <div class="d-flex">
	                <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
	                  <i class="ti ti-file-like me-2"></i>
	                  This action has been approved.
	                </div>
	              </div>
	              <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
	                <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
	              </button>
	            </div>
	          `;
	        	}
				  }
			    else if (newNode[0].actionTrigger.triggerType === "recurring") {
			    	triggerSelector.innerHTML = `
					  <div class="d-flex align-items-center justify-content-between mb-1">
						<div class="d-flex">
						  <div class="btn bg-${actionStatusClass}-super-subtle text-${actionStatusClass} meenoe-trigger-details">
							<i class="ti ti-calendar me-2"></i>
							This is a recurring action which happens once ${newNode[0].actionTrigger.frequency}. The next occurrence is scheduled for ${newNode[0].actionTrigger.triggerDate}
						  </div>
						</div>
						<button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-trigger disoc">
						  <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
						</button>
					  </div>
					`;
			    }

          const trigger = newNode[0].actionTrigger;
          oldNode.actionTrigger = trigger;
          break;

        case 'progressNumber':
          document.getElementById(oldNode.id).querySelector('.progress-number').textContent = newNode[0].progressNumber;
          oldNode.progressNumber = newNode[0].progressNumber;
          break;

        // Add cases for other properties as needed
        default:
          console.warn(`No handler defined for key: ${key}`);
          break;
      }
    }
  }

  applyChangesToDOMAndOldNode(changes, oldNode, newNode);
  console.log('Differences applied:', changes);

  return changes;
},

updateNodeWithChanges: function(nodeID, changes) {
  // Locate the node and the card element in the DOM
  const node = this.findNodeByID(nodeID);
  const card = document.querySelector(`#${nodeID}`);
  
  if (!node || !card) return;

  // Apply each change to the node and DOM selectively
  Object.entries(changes).forEach(([changeKey, change]) => {
    switch (changeKey) {
      case 'actionTitle':
        const titleElement = card.querySelector('.meenoe-action-title');
        if (titleElement) {
          titleElement.innerText = change.new;
        }
        node.actionTitle = change.new; // Update in tree array
        break;

      case 'expanded':
        if (change.new) {
          this.expandNode(node);
        } else {
          this.collapseNode(node);
        }
        node.expanded = change.new;
        break;

      case 'actionStatus':
        const statusElement = card.querySelector('.status-element');
        if (statusElement) {
          statusElement.innerText = change.new;
        }
        node.actionStatus = change.new;
        break;

      case 'childNodes':
        // Handle addition or removal of child nodes as needed
        this.updateChildNodes(node, change.new);
        break;

      default:
        // Add handling for other properties as needed
        console.warn(`Unhandled change for key: ${changeKey}`);
    }
  });
},

updateChildNodes: function(parentNode, newChildNodes) {
  newChildNodes.forEach(childJsonNode => {
    const existingChild = this.findNodeByID(childJsonNode.id);
    if (existingChild) {
      // Remove if already exists, then recreate to avoid duplication
      this.removeNode1(existingChild);
    }
    // Create and append the new child node
    let newChildNode = this.createNodeFromJson(childJsonNode);
    parentNode.childNodes.push(newChildNode);
    this.drawNode(parentNode.elementLi.querySelector('ul'), newChildNode);
    this.updateListClasses();
  });
},

// Function to trigger the diffing process for a single node by its ID
updateSingleNodeByID: function(oldNode, newNode) {
  const changes = this.diffNodeByID(oldNode, newNode);
  if (Object.keys(changes).length > 0) {
    this.updateNodeWithChanges(newNode.id, changes);
  }
},
// diff single node end

    // Serialize a specific node by ID
		serializeNodeById: function(node) {
	    //const node = this.findNodeByID(id);
	    if (!node || !node.elementLi) return null; // Return if node not found or invalid

	    function treeNode(node) {
        const elementLi = node.elementLi.childNodes[1]?.childNodes[0];
        const actionTypeElement = elementLi?.querySelector('.meenoe_action_type');
        const actionTitleElement = elementLi?.querySelector('.meenoe-ed-title');

        return {
          id: node.id ?? null,
          actionStatus: node.actionStatus ?? null,
          parent: node.parent?.id ?? null,
          expanded: node.expanded ?? null,
          childNodes: node.childNodes?.map(treeNode) ?? [],
          tag: node.tag ?? null,
          actionTitle: actionTitleElement ? actionTitleElement.innerText : null,
          actionType: actionTypeElement ? actionTypeElement.innerText : null,
          actionDate: node.actionDate ?? null,
          actionTrigger: node.actionTrigger ?? null,
          actionUsers: node.actionUsers ?? null,
          linkedAgenda: node.linkedAgenda ?? null,
          progressNumber: node.progressNumber ?? null,
        };
	    }

	    const serializedNode = treeNode(node);
	    const compressedNode = serializedNode;
	    console.log("Serialized Node:", compressedNode);
	    return compressedNode;
		},

    serializeActions: function(tree) {
      const treeState = [];

      function treeNode(node) {
        if (!node.elementLi) return null; // Skip if node is invalid

        const elementLi = node.elementLi.childNodes[1]?.childNodes[0];
        const actionTypeElement = elementLi?.querySelector('.meenoe_action_type');
        const actionTitleElement = elementLi?.querySelector('.meenoe-ed-title');

        let progress = node.progressNumber + '';

        const serializedNode = {
          id: node.id ?? null,
          actionStatus: node.actionStatus ?? null,
          parent: node.parent?.id ?? null,
          expanded: node.expanded ?? null,
          childNodes: node.childNodes?.map(treeNode) ?? [],
          tag: node.tag ?? null,
          actionTitle: actionTitleElement ? actionTitleElement.innerText : null,
          actionType: actionTypeElement ? actionTypeElement.innerText : null,
          actionDate: node.actionDate ?? null,
          actionTrigger: node.actionTrigger ?? null,
          actionUsers: node.actionUsers ?? null,
          linkedAgenda: node.linkedAgenda ?? null,
          progressNumber: 0,
        };

        return serializedNode;
      }

      tree.childNodes.forEach((node) => {
        const serialized = treeNode(node);
        if (serialized) treeState.push(serialized);
      });

      const compressedState = treeState;
      //meenoe.meenoeActions = compressedState;
      return compressedState;
    },

    deserializeTree: function(json, tree) {
      let jsonArray = decompressJsonArray(json);
      const nodeMap = {};

      function createNodeFromJson(jsonNode) {
        const node = {
          id: jsonNode.id,
          actionStatus: jsonNode.actionStatus,
          parent: jsonNode.parent ? jsonNode.parent.id : null,
          expanded: jsonNode.expanded,
          childNodes: [],
          tag: jsonNode.tag,
          actionTitle: jsonNode.actionTitle,
          actionType: jsonNode.actionType,
          actionDate: jsonNode.actionDate,
          actionTrigger: jsonNode.actionTrigger,
          actionUsers: jsonNode.actionUsers,
          linkedAgenda: jsonNode.linkedAgenda,
          progressNumber: jsonNode.progressNumber,
          removeNode: function() {
            v_tree.removeNode(this);
          },
          removeNode1: function() {
            v_tree.removeNode1(this);
          },
          toggleNode: function(p_event) {
            v_tree.toggleNode(this);
          },
          expandNode: function(p_event) {
            v_tree.expandNode(this);
          },
          expandSubtree: function() {
            v_tree.expandSubtree(this);
          },
          setText: function(p_text) {
            v_tree.setText(this, p_text);
          },
          collapseNode: function() {
            v_tree.collapseNode(this);
          },
          collapseSubtree: function() {
            v_tree.collapseSubtree(this);
          },
          removeChildNodes: function() {
            v_tree.removeChildNodes(this);
          },
          createChildNode: function(p_text, p_expanded, p_icon, p_tag, p_contextmenu) {
            let childNode = v_tree.createNode(p_text, p_expanded, p_icon, this, p_tag, p_contextmenu);
            v_tree.expandNode(this);
            customSmoothScrollTo(childNode.elementLi);
            return childNode;
          }
        };
        if (jsonNode.childNodes.length > 0) {
          jsonNode.childNodes.forEach((childJsonNode) => {
            const childNode = createNodeFromJson(childJsonNode);
            node.childNodes.push(childNode);
            childNode.parent = node;
          });
        }
        return node;
      }
      jsonArray.forEach((jsonNode) => {
        let node = createNodeFromJson(jsonNode);
        tree.childNodes.push(node);
      });
      tree.treeID = "500";
      return tree;
    },
    clearTree: function() {
      this.childNodes = [];
    },
    updateTree: function(trees, nodeArray) {
      tree.clearTree();
      tree.deserializeTree(nodeArray, trees);
      tree.drawTree();
      return tree;
    },
    adjustLines: function(p_ul, p_recursive) {
      let tree = p_ul;
      let lists = [];
      if (tree.childNodes.length > 0) {
        lists = [tree];
        if (p_recursive) {
          for (let i = 0; i < tree.getElementsByTagName("ul").length; i++) {
            let check_ul = tree.getElementsByTagName("ul")[i];
            if (check_ul.childNodes.length != 0)
              lists[lists.length] = check_ul;
          }
        }
      }
      for (let i = 0; i < lists.length; i++) {
        let item = lists[i].lastChild;
        let itemPrevious = item.previousSibling;
        while (!item.tagName || item.tagName.toLowerCase() != "li") {
          item = item.previousSibling;
        }
        if (item.classList.contains('meenoe-child-li')) {
          item.classList.remove('meenoe-child-li');
          item.classList.add('meenoe-child-last');
        }
      }
    }
  }
  return tree;
}
//helper functions
function createSimpleElement(p_type, p_id, p_class) {
  element = document.createElement(p_type);
  if (p_id != undefined)
    element.id = p_id;
  if (p_class != undefined)
    element.className = p_class;
  return element;
}

function customSmoothScrollTo(elementOrSelector) {
  let targetElement;
  if (typeof elementOrSelector === 'string') {
    targetElement = document.getElementById(elementOrSelector);
  } else if (elementOrSelector instanceof HTMLElement) {
    targetElement = elementOrSelector;
  } else {
    return;
  }
  if (!targetElement) {
    console.error('Element not found:', elementOrSelector);
    return;
  }
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 150;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 300;
  let startTime = null;

  function animation() {
    const currentTime = performance.now();
    if (startTime === null) {
      startTime = currentTime;
    }
    const timeElapsed = currentTime - startTime;
    const nextStep = easeInOutQuad(timeElapsed, startPosition, distance, duration);
 
    window.scrollTo(0, nextStep);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  requestAnimationFrame(animation);
}

function getChanges(oldItem, newItem) {
  const changes = {};
  const properties = Object.keys(oldItem);
  properties.forEach(property => {
    if (oldItem[property] !== newItem[property]) {
      changes[property] = {
        old: oldItem[property],
        new: newItem[property]
      };
    }
  });
  return changes;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 99) + 1;
}

// Generate a unique ID function (example implementation)
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}