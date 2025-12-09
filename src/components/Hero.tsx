import Link from "next/link";
export default function Hero() {
  return (
    <section className="bg-amber-100 text-center py-20 px-6">
      <h1 className="text-5xl font-extrabold mb-4 text-amber-950">
        Handcrafted Haven
      </h1>
      <p className="text-lg text-amber-950 max-w-2xl mx-auto mb-6">
        Discover one-of-a-kind handmade creations from talented artisans around
        the world. Shop sustainably and support local creators.
      </p>
      <Link
        href="#products"
        className="bg-amber-950 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
      >
        Shop Now
      </Link>
    </section>
  );
}
