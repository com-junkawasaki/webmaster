interface Props {
  title: string;
  src: string;
  slug?: string;
}

export default function CoverImage({ title, src, slug }: Props) {
  const image = (
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={`shadow-sm w-full ${slug ? "hover:shadow-lg transition-shadow duration-200" : ""}`}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <a href={`/posts/${slug}`} aria-label={title}>
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
}
