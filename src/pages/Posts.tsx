import { useEffect, useState } from "react";
import { getPosts, type Post } from "@/api/blogApi";
import PostCard from "@/components/PostCard";
import Loader from "@/components/Loader";
import ErrorMsg from "@/components/ErrorMsg";
import { BookOpen } from "lucide-react";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular error aleatorio (20% de probabilidad)
      if (Math.random() < 0.05) {
        throw new Error("Error simulado del servicio");
      }

      const response = await getPosts();
      setPosts(response.data.slice(0, 12));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <Loader />;

  if (error) return <ErrorMsg message={error} onRetry={loadPosts} />;

  return (
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Blog Microservicio
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Explorando el Universo de los Lenguajes de Programación
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cosmos Digital es un módulo frontend diseñado como un microservicio
            de blog simulado, construido con React + Vite, Axios y Tailwind CSS.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {posts.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Posts Disponibles
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">
              Tiempo de Actividad
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">&lt;100ms</div>
            <div className="text-sm text-muted-foreground">
              Tiempo de Respuesta
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
