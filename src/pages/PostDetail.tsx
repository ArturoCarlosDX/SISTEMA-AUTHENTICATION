import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, type Post } from "@/api/blogApi";
import Loader from "@/components/Loader";
import ErrorMsg from "@/components/ErrorMsg";
import CommentsList from "@/components/CommentsList";
import { ArrowLeft, User, Calendar, Clock } from "lucide-react";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getPostById(id);
      setPost(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  if (loading) return <Loader />;

  if (error) return <ErrorMsg message={error} onRetry={loadPost} />;

  if (!post) return null;

  return (
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-lg hover:scale-105 transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Blog</span>
        </Link>

        {/* Post Content */}
        <article className="glass-card rounded-3xl p-8 md:p-12">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span>Usuario {post.userId}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Post #{post.id}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-accent" />
              <span>2 min lectura</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 capitalize leading-tight">
            {post.title}
          </h1>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8"></div>

          {/* Body */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed">
              {post.body}
            </p>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
        </article>

        {/* Comments */}
        <CommentsList postId={post.id} />

        {/* Related Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">1.2k</div>
            <div className="text-xs text-muted-foreground">Vistas</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">48</div>
            <div className="text-xs text-muted-foreground">Comentarios</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">95%</div>
            <div className="text-xs text-muted-foreground">Calificación</div>
          </div>
        </div>
      </div>
    </div>
  );
}
