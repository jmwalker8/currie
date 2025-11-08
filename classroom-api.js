// ===================================
// Google Classroom API Service Module
// ===================================

class ClassroomAPI {
    constructor() {
        this.courses = [];
        this.assignments = [];
    }

    /**
     * Fetch all courses the user is enrolled in
     */
    async getCourses() {
        try {
            console.log('Fetching courses...');

            const response = await gapi.client.classroom.courses.list({
                studentId: 'me',
                courseStates: ['ACTIVE'],
                pageSize: 50
            });

            this.courses = response.result.courses || [];
            console.log(`Found ${this.courses.length} courses`);

            return this.courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }

    /**
     * Fetch all coursework (assignments) for a specific course
     */
    async getCoursework(courseId) {
        try {
            console.log(`Fetching coursework for course ${courseId}...`);

            const response = await gapi.client.classroom.courses.courseWork.list({
                courseId: courseId,
                orderBy: 'dueDate desc',
                pageSize: 100
            });

            return response.result.courseWork || [];
        } catch (error) {
            console.error(`Error fetching coursework for course ${courseId}:`, error);
            return [];
        }
    }

    /**
     * Fetch student submission for a specific coursework
     */
    async getSubmission(courseId, courseWorkId) {
        try {
            const response = await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
                courseId: courseId,
                courseWorkId: courseWorkId,
                userId: 'me'
            });

            const submissions = response.result.studentSubmissions || [];
            return submissions.length > 0 ? submissions[0] : null;
        } catch (error) {
            console.error(`Error fetching submission for coursework ${courseWorkId}:`, error);
            return null;
        }
    }

    /**
     * Fetch all assignments from all courses
     */
    async getAllAssignments() {
        try {
            console.log('Fetching all assignments...');

            // First, get all courses
            const courses = await this.getCourses();

            if (courses.length === 0) {
                console.log('No courses found');
                return [];
            }

            // Then, fetch coursework for each course
            const assignmentPromises = courses.map(async (course) => {
                const coursework = await this.getCoursework(course.id);

                // Fetch submissions for each coursework to check completion status
                const assignmentsWithSubmissions = await Promise.all(
                    coursework.map(async (work) => {
                        const submission = await this.getSubmission(course.id, work.id);
                        return this.formatAssignment(work, course, submission);
                    })
                );

                return assignmentsWithSubmissions;
            });

            const assignmentArrays = await Promise.all(assignmentPromises);
            this.assignments = assignmentArrays.flat();

            console.log(`Found ${this.assignments.length} total assignments`);
            return this.assignments;
        } catch (error) {
            console.error('Error fetching all assignments:', error);
            throw error;
        }
    }

    /**
     * Format assignment data into our app's structure
     */
    formatAssignment(coursework, course, submission) {
        // Parse due date
        let dueDate = null;
        if (coursework.dueDate) {
            const { year, month, day } = coursework.dueDate;
            const hour = coursework.dueTime?.hours || 23;
            const minute = coursework.dueTime?.minutes || 59;
            dueDate = new Date(year, month - 1, day, hour, minute);
        }

        // Determine if assignment is completed
        const isCompleted = submission &&
            (submission.state === 'TURNED_IN' ||
             submission.state === 'RETURNED' ||
             submission.assignedGrade !== undefined);

        // Determine priority based on due date
        let priority = 'normal';
        if (dueDate) {
            const now = new Date();
            const diffTime = dueDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                priority = 'urgent'; // Overdue
            } else if (diffDays <= 2) {
                priority = 'urgent';
            } else if (diffDays <= 7) {
                priority = 'upcoming';
            }
        }

        return {
            id: coursework.id,
            title: coursework.title,
            description: coursework.description || 'No description provided',
            class: course.name,
            classId: course.id,
            dueDate: dueDate,
            priority: priority,
            completed: isCompleted,
            link: coursework.alternateLink,
            maxPoints: coursework.maxPoints,
            workType: coursework.workType,
            state: coursework.state,
            submissionState: submission?.state,
            assignedGrade: submission?.assignedGrade,
            creationTime: new Date(coursework.creationTime),
            updateTime: new Date(coursework.updateTime)
        };
    }

    /**
     * Get a single course by ID
     */
    async getCourse(courseId) {
        try {
            const response = await gapi.client.classroom.courses.get({
                id: courseId
            });

            return response.result;
        } catch (error) {
            console.error(`Error fetching course ${courseId}:`, error);
            throw error;
        }
    }

    /**
     * Mark an assignment as done (this modifies the student submission)
     */
    async turnInAssignment(courseId, courseWorkId) {
        try {
            // First, get the student submission
            const submissionsResponse = await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
                courseId: courseId,
                courseWorkId: courseWorkId,
                userId: 'me'
            });

            const submissions = submissionsResponse.result.studentSubmissions || [];
            if (submissions.length === 0) {
                throw new Error('No submission found');
            }

            const submission = submissions[0];

            // Turn in the submission
            const response = await gapi.client.classroom.courses.courseWork.studentSubmissions.turnIn({
                courseId: courseId,
                courseWorkId: courseWorkId,
                id: submission.id
            });

            console.log('Assignment turned in successfully');
            return response.result;
        } catch (error) {
            console.error('Error turning in assignment:', error);
            throw error;
        }
    }

    /**
     * Reclaim an assignment (mark as not done)
     */
    async reclaimAssignment(courseId, courseWorkId) {
        try {
            // First, get the student submission
            const submissionsResponse = await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
                courseId: courseId,
                courseWorkId: courseWorkId,
                userId: 'me'
            });

            const submissions = submissionsResponse.result.studentSubmissions || [];
            if (submissions.length === 0) {
                throw new Error('No submission found');
            }

            const submission = submissions[0];

            // Reclaim the submission
            const response = await gapi.client.classroom.courses.courseWork.studentSubmissions.reclaim({
                courseId: courseId,
                courseWorkId: courseWorkId,
                id: submission.id
            });

            console.log('Assignment reclaimed successfully');
            return response.result;
        } catch (error) {
            console.error('Error reclaiming assignment:', error);
            throw error;
        }
    }

    /**
     * Refresh assignments (re-fetch from API)
     */
    async refreshAssignments() {
        console.log('Refreshing assignments...');
        return await this.getAllAssignments();
    }

    /**
     * Get assignments filtered by various criteria
     */
    getFilteredAssignments(filter = 'all') {
        let filtered = [...this.assignments];

        switch (filter) {
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

        // Sort by due date (earliest first)
        return filtered.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate - b.dueDate;
        });
    }

    /**
     * Get statistics about assignments
     */
    getStats() {
        return {
            urgent: this.assignments.filter(a => !a.completed && a.priority === 'urgent').length,
            upcoming: this.assignments.filter(a => !a.completed && a.priority === 'upcoming').length,
            completed: this.assignments.filter(a => a.completed).length,
            total: this.assignments.filter(a => !a.completed).length,
            totalAll: this.assignments.length
        };
    }
}

// Create a global instance
window.classroomAPI = new ClassroomAPI();
