const About = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <section className="relative mb-8 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 px-5 py-12 text-center sm:px-10 sm:py-24">
          <span className="badge badge-primary mb-3">About Aviora</span>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-5xl">Our Story</h1>
          <p className="mb-0 text-base sm:text-lg text-white/75">Crafting beauty since 2024</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="mb-4 text-3xl font-bold">The Art of Fine Jewelry</h2>
          <p className="mb-4 text-lg leading-relaxed text-base-content/70">
            At Aviora, every piece tells a story. Founded with a passion for timeless elegance,
            we bring together master artisans who transform premium metals and ethically sourced
            gemstones into wearable works of art.
          </p>
          <p className="mb-4 leading-relaxed text-base-content/70">
            Our commitment to handcrafted excellence means no two pieces are exactly alike. From
            the initial sketch to the final polish, each creation passes through the hands of
            skilled craftspeople who have honed their art over decades.
          </p>
          <p className="mb-0 leading-relaxed text-base-content/70">
            We believe luxury should be responsible. That is why we prioritize sustainable sourcing,
            working only with suppliers who share our values of environmental stewardship and fair
            labor practices. Every gemstone is traceable, every metal responsibly refined.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.pexels.com/photos/10983780/pexels-photo-10983780.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Jewelry crafting detail"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="card border border-base-300 bg-base-200">
            <div className="card-body">
              <h5>Master Craftsmanship</h5>
              <p className="mb-0 text-base-content/70">Every piece is handcrafted by skilled artisans who pour passion and precision into their work.</p>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-200">
            <div className="card-body">
              <h5>Ethical Sourcing</h5>
              <p className="mb-0 text-base-content/70">Responsibly sourced gemstones and metals, ensuring beauty without compromise.</p>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-200">
            <div className="card-body">
              <h5>Lifetime Warranty</h5>
              <p className="mb-0 text-base-content/70">Our commitment to lasting beauty — every Aviora piece is backed by our lifetime warranty.</p>
            </div>
          </article>
        </div>
      </section>

      {/* Our Promise */}
      <section className="mb-8">
        <div className="border-t border-base-300 pt-6">
          <h5>Our Promise</h5>
          <p className="mb-0 text-base-content/70">
            We are dedicated to creating jewelry that celebrates life's most precious moments.
            From engagement rings to everyday elegance, every Aviora piece is designed to be
            treasured for generations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
