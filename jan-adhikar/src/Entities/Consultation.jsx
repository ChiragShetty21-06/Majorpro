// src/Entities/Consultation.jsx

export class Consultation {

  // 🔹 Get all consultations (sorted)
  static async list(sort = "-created_date", limit = 50) {
    const raw = localStorage.getItem("consultations");
    let data = raw ? JSON.parse(raw) : [];

    // Apply sorting by created_date (DESC)
    if (sort === "-created_date") {
      data = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    // Apply limit
    return data.slice(0, limit);
  }

  // 🔹 Save new consultation
  static async create(formData) {
    const raw = localStorage.getItem("consultations");
    const data = raw ? JSON.parse(raw) : [];

    const newEntry = {
      id: crypto.randomUUID(),
      query_title: formData.query_title,
      detailed_question: formData.detailed_question,
      category: formData.category,
      user_location: formData.user_location,
      urgency_level: formData.urgency_level,
      contact_preference: formData.contact_preference,
      language: formData.language,
      is_anonymous: formData.is_anonymous,
      created_date: new Date().toISOString(),

      // By default: No response yet
      response: "",
      status: "Pending"
    };

    data.push(newEntry);

    localStorage.setItem("consultations", JSON.stringify(data));

    return newEntry;
  }

  // 🔹 Fetch a single consultation by ID
  static async getById(id) {
    const raw = localStorage.getItem("consultations");
    const data = raw ? JSON.parse(raw) : [];

    return data.find((c) => c.id === id) || null;
  }

  // 🔹 Update consultation (for admin later)
  static async update(id, updateFields) {
    const raw = localStorage.getItem("consultations");
    let data = raw ? JSON.parse(raw) : [];

    data = data.map((item) =>
      item.id === id ? { ...item, ...updateFields } : item
    );

    localStorage.setItem("consultations", JSON.stringify(data));
    return true;
  }
}
