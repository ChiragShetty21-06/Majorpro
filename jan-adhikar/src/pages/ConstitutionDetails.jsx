import React, { useEffect, useState } from "react";
import { ConstitutionArticle } from "@/Entities/ConstitutionArticle.jsx";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ConstitutionDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");

  const [article, setArticle] = useState(null);

  useEffect(() => {
    ConstitutionArticle.getById(id).then(setArticle);
  }, [id]);

  if (!article) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>
            Article {article.article_number}: {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{article.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
