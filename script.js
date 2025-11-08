// ===================================
// State Management
// ===================================
let assignments = [];
let currentFilter = 'all';
let currentView = 'list';
let selectedAssignment = null;
let isLoadingAssignments = false;

// ===================================
// Utility Functions
// ===================================
function formatDate(date) {
    if (!date) {
        return 'No due date';
    }

    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'Overdue';
    } else if (diffDays === 0) {
        return 'Due today';
    } else if (diffDays === 1) {
        return 'Due tomorrow';
    } else if (diffDays <= 7) {
        return `Due in ${diffDays} days`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function showLoading(show = true) {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function getPriorityLabel(priority) {
    const labels = {
        urgent: '⚠️ Due Soon',
        upcoming: '📅 This Week',
        normal: '✓ Upcoming'
    };
    return labels[priority] || '';
}

// ===================================
// Data Functions
// ===================================
function getFilteredAssignments() {
    let filtered = [...assignments];

    switch (currentFilter) {
        case 'urgent':
            filtered = filtered.filter(a => !a.completed && a.priority === 'urgent');
            break;
        case 'upcoming':
            filtered = filtered.filter(a => !a.completed && a.priority === 'upcoming');
            break;
        case 'completed':
            filtered = filtered.filter(a => a.completed);
            break;
        case 'all':
        default:
            filtered = filtered.filter(a => !a.completed);
            break;
    }

    return filtered.sort((a, b) => a.dueDate - b.dueDate);
}

function updateStats() {
    const urgentCount = assignments.filter(a => !a.completed && a.priority === 'urgent').length;
    const upcomingCount = assignments.filter(a => !a.completed && a.priority === 'upcoming').length;
    const completedCount = assignments.filter(a => a.completed).length;
    const totalCount = assignments.filter(a => !a.completed).length;

    document.getElementById('urgentCount').textContent = urgentCount;
    document.getElementById('upcomingCount').textContent = upcomingCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('totalCount').textContent = totalCount;
}

// ===================================
// Render Functions
// ===================================
function renderAssignments() {
    const assignmentsList = document.getElementById('assignmentsList');
    const emptyState = document.getElementById('emptyState');
    const filtered = getFilteredAssignments();

    if (filtered.length === 0) {
        assignmentsList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    assignmentsList.innerHTML = filtered.map(assignment => `
        <div class="assignment-card" data-id="${assignment.id}">
            <div class="assignment-priority ${assignment.priority}"></div>
            <div class="assignment-content">
                <div class="assignment-header">
                    <div>
                        <h3 class="assignment-title">${assignment.title}</h3>
                        <p class="assignment-class">${assignment.class}</p>
                    </div>
                    <span class="assignment-badge ${assignment.priority}">
                        ${getPriorityLabel(assignment.priority)}
                    </span>
                </div>
                <p class="assignment-description">${assignment.description}</p>
                <div class="assignment-footer">
                    <div class="assignment-due">
                        <span>📅</span>
                        <span>${formatDate(assignment.dueDate)}</span>
                    </div>
                    <div class="assignment-checkbox ${assignment.completed ? 'checked' : ''}"
                         data-id="${assignment.id}"
                         onclick="toggleComplete(event, ${assignment.id})">
                        ${assignment.completed ? '✓' : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners to assignment cards
    document.querySelectorAll('.assignment-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('assignment-checkbox')) {
                openAssignmentModal(parseInt(card.dataset.id));
            }
        });
    });

    updateStats();
}

// ===================================
// Event Handlers
// ===================================
async function toggleComplete(event, id) {
    event.stopPropagation();
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const wasCompleted = assignment.completed;

    try {
        // Optimistically update UI
        assignment.completed = !assignment.completed;
        renderAssignments();

        // Make API call to turn in or reclaim assignment
        if (assignment.completed) {
            await classroomAPI.turnInAssignment(assignment.classId, assignment.id);
        } else {
            await classroomAPI.reclaimAssignment(assignment.classId, assignment.id);
        }

        console.log(`Assignment ${assignment.completed ? 'turned in' : 'reclaimed'} successfully`);
    } catch (error) {
        console.error('Error toggling assignment completion:', error);

        // Revert on error
        assignment.completed = wasCompleted;
        renderAssignments();

        showError('Failed to update assignment status. Please try again.');
    }
}

function openAssignmentModal(id) {
    selectedAssignment = assignments.find(a => a.id === id);
    if (!selectedAssignment) return;

    document.getElementById('modalTitle').textContent = selectedAssignment.title;
    document.getElementById('modalClass').textContent = selectedAssignment.class;
    document.getElementById('modalDueDate').textContent = formatDate(selectedAssignment.dueDate);
    document.getElementById('modalDescription').textContent = selectedAssignment.description;

    const modal = document.getElementById('assignmentModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('assignmentModal');
    modal.classList.remove('show');
    selectedAssignment = null;
}

function openInClassroom() {
    if (selectedAssignment && selectedAssignment.link) {
        window.open(selectedAssignment.link, '_blank');
    }
}

async function connectToGoogleClassroom() {
    try {
        showLoading(true);
        console.log('Connecting to Google Classroom...');

        // Initialize Google Auth if not already done
        if (!googleAuth.gapiInitialized) {
            await googleAuth.initClient();
        }

        // Sign in the user
        await googleAuth.signIn();

    } catch (error) {
        console.error('Error connecting to Google Classroom:', error);
        showError('Failed to connect to Google Classroom. Please check your credentials and try again.');
        showLoading(false);
    }
}

async function loadAssignments() {
    try {
        isLoadingAssignments = true;
        showLoading(true);
        console.log('Loading assignments from Google Classroom...');

        // Fetch all assignments from Google Classroom
        const fetchedAssignments = await classroomAPI.getAllAssignments();

        // Update local state
        assignments = fetchedAssignments;

        // Show dashboard
        document.getElementById('welcomeSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';

        // Render assignments
        renderAssignments();

        console.log('Assignments loaded successfully');
    } catch (error) {
        console.error('Error loading assignments:', error);
        showError('Failed to load assignments. Please try again.');
    } finally {
        isLoadingAssignments = false;
        showLoading(false);
    }
}

async function refreshAssignments() {
    if (isLoadingAssignments) return;

    try {
        isLoadingAssignments = true;
        showLoading(true);
        console.log('Refreshing assignments...');

        const fetchedAssignments = await classroomAPI.refreshAssignments();
        assignments = fetchedAssignments;

        renderAssignments();
        console.log('Assignments refreshed successfully');
    } catch (error) {
        console.error('Error refreshing assignments:', error);
        showError('Failed to refresh assignments. Please try again.');
    } finally {
        isLoadingAssignments = false;
        showLoading(false);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    // Save preference
    localStorage.setItem('darkMode', isDark);

    // Update button icon
    const icon = document.querySelector('#darkModeToggle .icon');
    icon.textContent = isDark ? '☀️' : '🌙';
}

function setFilter(filter) {
    currentFilter = filter;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderAssignments();
}

function setView(view) {
    currentView = view;

    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Note: Calendar view would need additional implementation
    if (view === 'calendar') {
        alert('Calendar view coming soon! This would integrate with Google Calendar API.');
    }
}

// ===================================
// Initialization
// ===================================
async function init() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeToggle .icon');
        icon.textContent = '☀️';
    }

    // Set up Google Auth callbacks
    googleAuth.onAuthSuccess = async () => {
        console.log('Authentication successful, loading assignments...');
        await loadAssignments();
    };

    googleAuth.onAuthError = (error) => {
        console.error('Authentication failed:', error);
        showError('Authentication failed. Please try again.');
        showLoading(false);
    };

    googleAuth.onSignOut = () => {
        console.log('User signed out');
        assignments = [];
        document.getElementById('welcomeSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    };

    // Initialize Google API Client
    try {
        await googleAuth.initClient();
        console.log('Google API Client initialized');
    } catch (error) {
        console.error('Failed to initialize Google API:', error);
        // Don't show error yet - wait until user tries to connect
    }

    // Event Listeners
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('connectGoogleBtn').addEventListener('click', connectToGoogleClassroom);
    document.getElementById('getStartedBtn').addEventListener('click', connectToGoogleClassroom);

    // Filter tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    // Modal controls
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
    document.getElementById('modalOpenBtn').addEventListener('click', openInClassroom);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('assignmentModal').classList.contains('show')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    console.log('ClassroomFocus initialized successfully!');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
