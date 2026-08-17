export default function RatingStars({ rating }) {
  return (
    <span className="rating" aria-label={`${rating} out of 10`}>
      ★ {rating}
    </span>
  );
}
