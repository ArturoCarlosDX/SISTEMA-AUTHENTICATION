import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/api/blogApi";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:glow-effect block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          Post #{post.id}
        </span>
        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h2 className="text-xl font-bold mb-3 capitalize group-hover:text-primary transition-colors">
        {post.title}
      </h2>
      
      <p className="text-muted-foreground line-clamp-3">
        {post.body}
      </p>
      
      <div className="mt-4 flex items-center text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
        Usuario {post.userId}
      </div>
    </Link>
  );
}
