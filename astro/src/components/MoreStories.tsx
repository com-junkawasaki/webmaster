import PostPreview from "./PostPreview.tsx";

interface Author {
  name: string;
  picture: string;
}

interface Post {
  slug: string;
  title: string;
  date?: string;
  coverImage: string;
  author?: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
}

interface Props {
  posts: Post[];
}

export default function MoreStories({ posts }: Props) {
  return (
    <section className="animate-slide-up">
      <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post, index) => (
          <div
            key={post.slug}
            className="transform hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PostPreview
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
