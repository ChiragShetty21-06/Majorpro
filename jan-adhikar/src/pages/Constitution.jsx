import React, { useState, useEffect } from "react";
import { ConstitutionArticle } from "@/Entities/ConstitutionArticle.jsx";
import { constitutionBooks } from "@/Entities/Books.jsx";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Search, BookText, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function ConstitutionPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [bookSearch, setBookSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(constitutionBooks);

  const [isLoading, setIsLoading] = useState(true);

  // 📌 Fetch Constitution Articles
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const data = await ConstitutionArticle.list();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 📌 Article Search Logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const results = articles.filter((a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.article_number.toString().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredArticles(results);
  }, [searchTerm, articles]);

  // 📌 Book Search Logic
  useEffect(() => {
    const results = constitutionBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.languages.some((l) =>
          l.lang.toLowerCase().includes(bookSearch.toLowerCase())
        )
    );

    setFilteredBooks(results);
  }, [bookSearch]);

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <Landmark className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-slate-900">
          The Constitution of India
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Browse, search, and understand the supreme law of India.
        </p>
      </div>

    
      {/* BOOK DOWNLOAD SECTION */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Download className="w-6 h-6 text-blue-600" />
          Download Constitution Books (All Languages)
        </h2>

        {/* Book Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search books by title or language..."
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            className="pl-12 h-12 w-full"
          />
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.map((book, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {book.languages.map((l, i) => (
                    <a
                      key={i}
                      href={l.file}
                      target="_blank"
                      className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {l.lang} PDF
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ARTICLES LIST */}
      {isLoading ? (
        <p className="text-center text-slate-600 py-8">Loading articles...</p>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.article_number}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="w-5 h-5 text-green-700" />
                  Article {article.article_number}: {article.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-slate-700 line-clamp-2">
                  {article.content}
                </p>

                <Link
                  to={`/constitution/article?id=${article.article_number}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Read More →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
