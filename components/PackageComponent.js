function PackageCard({ title, price, features, gradient, textColor, btnColor }) {
  return (
    <div
      className={`bg-gradient-to-b ${gradient} rounded-md p-8 shadow-md items-center`}
    >
      <h3 className={`text-2xl font-bold ${textColor} mb-6 text-center`}>
        {title}
      </h3>
      <div className={`text-5xl font-bold ${textColor} text-center mb-8`}>
        {price}
        <span className="text-3xl ml-1 relative top-[-0.5em]">$</span>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <ul className="list-none p-0 mb-10 text-lg font-semibold">
        {features.map((feature, index) => (
          <li key={index} className={`${textColor} text-center mb-5`}>
            {feature}
            {index < features.length - 1 && <hr className="my-4 border-t border-gray-300" />}
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <button
          className={`font-bold py-2 px-4 rounded mt-4 transition ${btnColor}`}
          aria-label={`Choose the ${title}`}
        >
          Choose This Package
        </button>
      </div>
    </div>
  );
}

export default function PackageComponent() {
  const packages = [
    {
      title: "Basic Recruiter Package",
      price: "29.99",
      features: [
        "5 job postings per month",
        "Access to basic candidate profiles",
        "Payment gateway integration",
        "Limited use of assessment templates",
      ],
      gradient: "from-[#EDF0FF] to-[#CAD1F1]",
      textColor: "text-[#001571]",
      btnColor: "bg-[#001571] hover:bg-blue-700 text-white",
    },
    {
      title: "Professional Recruiter Package",
      price: "49.99",
      features: [
        "20 job postings per month",
        "Access to basic candidate profiles",
        "Payment gateway integration",
        "Limited use of assessment templates",
      ],
      gradient: "from-[#001C99] to-[#0C002E]",
      textColor: "text-white",
      btnColor: "bg-white hover:bg-blue-700 text-[#001571]",
    },
    {
      title: "Enterprise Recruiter Package",
      price: "99.99",
      features: [
        "30 job postings per month",
        "Access to basic candidate profiles",
        "Payment gateway integration",
        "Limited use of assessment templates",
      ],
      gradient: "from-[#EDF0FF] to-[#CAD1F1]",
      textColor: "text-[#001571]",
      btnColor: "bg-[#001571] hover:bg-blue-700 text-white",
    },
  ];

  return (
    <section className="py-16 w-full flex items-center justify-center">
      <div className="pb-3 w-[1280px]">
      <h2 className="text-2xl mb-5 font-bold text-center text-[#001571] pt-12">
        For Recruiters
      </h2>
      <p className="mb-8 text-lg text-center text-[#001571] font-semibold">
        Empower your hiring and assessment process with comprehensive tools
        designed to meet your goals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <PackageCard
            key={index}
            title={pkg.title}
            price={pkg.price}
            features={pkg.features}
            gradient={pkg.gradient}
            textColor={pkg.textColor}
            btnColor={pkg.btnColor}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
