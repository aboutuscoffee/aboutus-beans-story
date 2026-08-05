export default function Gallery({ images }) {
  if (!images?.length) return null;

  return (
    <section className="pb-16">
      <div className="grid grid-cols-2 gap-1.5 max-w-3xl mx-auto px-3">
        {images.map((url, i) => (
          <div
            key={url}
            className="overflow-hidden"
            style={{ aspectRatio: '4 / 5', gridColumn: i === 0 && images.length % 2 === 1 ? 'span 2' : undefined }}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
