import Avatar from "./Avatar.tsx";
import CoverImage from "./CoverImage.tsx";
import DateFormatter from "./DateFormatter.tsx";

interface Author {
  name: string;
  picture: string;
}

interface Props {
  title: string;
  coverImage: string;
  date?: string;
  excerpt: string;
  author?: Author;
  slug: string;
}

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <a href={`/posts/${slug}`} className="hover:underline">
          {title}
        </a>
      </h3>
      {date && (
        <div className="text-lg mb-4">
          <DateFormatter dateString={date} />
        </div>
      )}
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      {author && <Avatar name={author.name} picture={author.picture} />}
    </div>
  );
}
