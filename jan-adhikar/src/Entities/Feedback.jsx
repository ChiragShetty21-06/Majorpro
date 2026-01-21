// src/Entities/Feedback.jsx

export class Feedback {
  
  // 🔹 Get all feedback (sorted by date)
  static async list(sort = "-created_date", limit = 100) {
    const raw = localStorage.getItem("feedback");
    let data = raw ? JSON.parse(raw) : [];

    // Apply sorting by created_date (DESC)
    if (sort === "-created_date") {
      data = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    // Apply limit
    return data.slice(0, limit);
  }

  // 🔹 Save new feedback
  static async create(formData) {
    const raw = localStorage.getItem("feedback");
    const data = raw ? JSON.parse(raw) : [];

    const newEntry = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      feedback_type: formData.feedback_type,
      message: formData.message,
      created_date: new Date().toISOString(),
      read: false,
    };

    data.push(newEntry);
    localStorage.setItem("feedback", JSON.stringify(data));

    return newEntry;
  }

  // 🔹 Fetch a single feedback by ID
  static async getById(id) {
    const raw = localStorage.getItem("feedback");
    const data = raw ? JSON.parse(raw) : [];

    return data.find((f) => f.id === id) || null;
  }

  // 🔹 Update feedback (mark as read, etc.)
  static async update(id, updateFields) {
    const raw = localStorage.getItem("feedback");
    let data = raw ? JSON.parse(raw) : [];

    data = data.map((item) =>
      item.id === id ? { ...item, ...updateFields } : item
    );

    localStorage.setItem("feedback", JSON.stringify(data));
    return true;
  }

  // 🔹 Delete feedback
  static async delete(id) {
    const raw = localStorage.getItem("feedback");
    let data = raw ? JSON.parse(raw) : [];

    data = data.filter((item) => item.id !== id);
    localStorage.setItem("feedback", JSON.stringify(data));
    return true;
  }
}
