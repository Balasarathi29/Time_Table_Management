const ADMIN_KEY = 'exam_admin';
const TIMETABLE_KEY = 'exam_timetable';

export const storage = {
  getAdmin: () => {
    const admin = localStorage.getItem(ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  },

  setAdmin: (admin) => {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },

  removeAdmin: () => {
    localStorage.removeItem(ADMIN_KEY);
  },

  getTimetable: () => {
    const timetable = localStorage.getItem(TIMETABLE_KEY);
    return timetable ? JSON.parse(timetable) : [];
  },

  setTimetable: (timetable) => {
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
  },

  addExam: (exam) => {
    const timetable = storage.getTimetable();
    const newExam = {
      id: Date.now().toString(),
      ...exam,
      createdAt: new Date().toISOString()
    };
    timetable.push(newExam);
    storage.setTimetable(timetable);
    return newExam;
  },

  updateExam: (id, updatedExam) => {
    const timetable = storage.getTimetable();
    const index = timetable.findIndex(exam => exam.id === id);
    if (index !== -1) {
      timetable[index] = { ...timetable[index], ...updatedExam };
      storage.setTimetable(timetable);
      return timetable[index];
    }
    return null;
  },

  deleteExam: (id) => {
    const timetable = storage.getTimetable();
    const filtered = timetable.filter(exam => exam.id !== id);
    storage.setTimetable(filtered);
    return true;
  },

  initializeDefaultAdmin: () => {
    const admin = storage.getAdmin();
    if (!admin) {
      storage.setAdmin({
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com'
      });
    }
  }
};

storage.initializeDefaultAdmin();
