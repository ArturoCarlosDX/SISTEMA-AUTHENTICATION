import { useEffect, useState } from "react";
import { getCommentsByPostId, type Comment } from "@/api/blogApi";
import Loader from "@/components/Loader";
import ErrorMsg from "@/components/ErrorMsg";
import { User } from "lucide-react";

interface CommentsListProps {
  postId: number;
}

export default function CommentsList({ postId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCommentsByPostId(String(postId));
      setComments(res.data.slice(0, 10));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar comentarios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg message={error} onRetry={loadComments} />;

  if (!comments.length)
    return (
      <div className="text-sm text-muted-foreground">
        No hay comentarios aún.
      </div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comentarios</h3>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="glass-card p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.email}</div>
                <p className="mt-2 text-sm text-foreground/90">{c.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
