// Event delegation handler for publishing status dropdowns
function initPublishingStatusHandler() {
  // Use event delegation on document to handle all status dropdowns
  document.addEventListener('click', function(e) {
    const option = e.target.closest('.status-option');
    
    // If clicked element is not a status option, exit early
    if (!option) return;
    
    // Find the parent publishing status button
    const publishingStatusButton = option.closest('[id^="publishingStatus"], .publishing-status-dropdown');
    
    // If no valid parent found, exit
    if (!publishingStatusButton) return;
    
    e.preventDefault();
    
    // Find status elements within the same dropdown context
    const statusText = publishingStatusButton.querySelector('.status-text');
    const statusIndicator = publishingStatusButton.querySelector('.status-indicator');
    
    // Get new status data
    const newStatus = option.dataset.status;
    const newBg = option.dataset.bg;
    
    // Update status text
    if (statusText && newStatus) {
      statusText.textContent = newStatus;
    }
    
    // Update status indicator
    if (statusIndicator && newBg) {
      statusIndicator.className = 'status-indicator me-2'; // Reset classes
      statusIndicator.classList.add(`bg-${newBg}`);
    }
    
    // Optional: Close dropdown after selection
    const dropdown = publishingStatusButton.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
    
    // Optional: Dispatch custom event for other components to listen
    publishingStatusButton.dispatchEvent(new CustomEvent('statusChanged', {
      detail: { status: newStatus, background: newBg },
      bubbles: true
    }));
  });
}

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPublishingStatusHandler);
} else {
  initPublishingStatusHandler();
}