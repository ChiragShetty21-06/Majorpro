
export class ConstitutionArticle {
  static async list() {
    try {
      const res = await fetch("/ConstitutionArticles.json");
      if (!res.ok) return [];
      return res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  static async getById(id) {
    try {
      const res = await fetch("/ConstitutionArticles.json");
      if (!res.ok) return null;
      const data = await res.json();
      return data.find(a => a.article_number.toString() === id.toString()) || null;
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }
}
