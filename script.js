// ===================================
// State Management
// ===================================
let assignments = [];
let currentFilter = 'all';
let currentView = 'list';
let selectedAssignment = null;

// ===================================
// Mock Data - Replace with Google Classroom API data
// ===================================
const mockAssignments = [
    {
        id: 1,
        title: 'Math Homework - Chapter 5',
        class: 'Mathematics',
        description: 'Complete exercises 1-20 from Chapter 5. Show your work for all problems.',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        priority: 'urgent',
        completed: false,
        link: '#'
    },
    {
        id: 2,
        title: 'Essay: Climate Change',
        class: 'English Literature',
        description: 'Write a 1000-word essay on the impact of climate change on modern literature.',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: 'upcoming',
        completed: false,
        link: '#'
    },
    {
        id: 3,
        title: 'Science Lab Report',
        class: 'Biology',
        description: 'Submit lab report on photosynthesis experiment conducted last week.',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: 'upcoming',
        completed: false,
        link: '#'
    },
    {
        id: 4,
        title: 'History Presentation',
        class: 'World History',
        description: 'Create a 10-minute presentation on the Industrial Revolution.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: 'normal',
        completed: false,
        link: '#'
    },
    {
        id: 5,
        title: 'Spanish Vocabulary Quiz',
        class: 'Spanish II',
        description: 'Study vocabulary words 1-50 from Unit 3.',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: 'urgent',
        completed: false,
        link: '#'
    },
    {
        id: 6,
        title: 'Computer Science Project',
        class: 'Introduction to Programming',
        description: 'Create a simple calculator application using HTML, CSS, and JavaScript.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        priority: 'normal',
        completed: false,
        link: '#'
    }
];

// ===================================
// Utility Functions
// ===================================
function formatDate(date) {
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

function getPriorityFromDueDate(dueDate) {
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) {
        return 'urgent';
    } else if (diffDays <= 7) {
        return 'upcoming';
    } else {
        return 'normal';
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
function toggleComplete(event, id) {
    event.stopPropagation();
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        renderAssignments();
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

function showDashboard() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';

    // Load mock data
    assignments = mockAssignments.map(a => ({
        ...a,
        priority: getPriorityFromDueDate(a.dueDate)
    }));

    renderAssignments();
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
function init() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeToggle .icon');
        icon.textContent = '☀️';
    }

    // Event Listeners
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('connectGoogleBtn').addEventListener('click', showDashboard);
    document.getElementById('getStartedBtn').addEventListener('click', showDashboard);

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

// ===================================
// Google Classroom API Integration (Placeholder)
// ===================================
// TODO: Replace mock data with actual Google Classroom API calls
//
// async function connectGoogleClassroom() {
//     try {
//         // Initialize Google OAuth
//         // Fetch courses and assignments
//         // Update assignments array
//         // Render assignments
//     } catch (error) {
//         console.error('Error connecting to Google Classroom:', error);
//     }
// }
