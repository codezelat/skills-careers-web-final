function PackageCard({
  title,
  priceMonth,
  priceYear,
  features,
  gradient,
  textColor,
  btnColor,
  isFree,
  comingSoon,
}) {
  return (
    <div
      className={`relative bg-gradient-to-b ${gradient} rounded-md p-8 shadow-md items-center ${
        comingSoon ? "opacity-90" : ""
      }`}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
          Coming Soon
        </div>
      )}
      <h3 className={`text-2xl font-bold ${textColor} mb-6 text-center`}>
        {title}
      </h3>
      <div className="mb-8">
        <div className={`text-5xl font-bold ${textColor} text-center`}>
          {comingSoon ? "Coming Soon" : "Free"}
        </div>
        {!comingSoon && (
          <p className={`text-sm text-center ${textColor} mt-2 opacity-70`}>
            No credit card required
          </p>
        )}
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <ul className="list-none p-0 mb-10 text-lg font-semibold">
        {features.map((feature, index) => (
          <li key={index} className={`${textColor} text-center mb-5`}>
            {feature}
            {index < features.length - 1 && (
              <hr className="my-4 border-t border-gray-300" />
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <button
          className={`font-bold py-2 px-4 rounded mt-4 transition ${
            comingSoon
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : btnColor
          }`}
          disabled={comingSoon}
          aria-label={`Choose the ${title}`}
        >
          {comingSoon ? "Notify Me" : "Get Started Free"}
        </button>
      </div>
    </div>
  );
}

export default function PackageComponent() {
  const packages = [
    {
      title: "Basic - Essential Hiring Tools",
      priceMonth: "6,000",
      priceYear: "60,000",
      isFree: true,
      comingSoon: false,
      features: [
        "Advertise unlimited jobs",
        "Recruiter profile + dashboard (recruitment details)",
        "See candidate applications in real time",
        "Create events & view bookings",
        "Send announcements to candidates",
        "Company profile linked to website & Social media (Brand building)",
        "Jobs cross-posted to Skills Careers pages (Organic reach)",
        "Free sustainability job postings",
        "Online payment gateway",
        "Free RASIC Assessment view",
      ],
      gradient: "from-[#EDF0FF] to-[#CAD1F1]",
      textColor: "text-[#001571]",
      btnColor: "bg-[#001571] hover:bg-blue-700 text-white",
    },
    {
      title: "Professional - Smart Matching ATS",
      priceMonth: "16,000",
      priceYear: "160,000",
      isFree: false,
      comingSoon: true,
      features: [
        "Everything in Basic",
        "Intelligent Matching ATS",
        "View candidate video CVs",
        "CV Access by Rating: - All Bronze candidates, - Up to 02 Silver applications, - Up to 03 Gold applications, - Up to 05 Platinum applications",
        "Choose 3 Behavioral Questions for pre-screening",
      ],
      gradient: "from-[#001C99] to-[#0C002E]",
      textColor: "text-white",
      btnColor: "bg-white hover:bg-blue-700 text-[#001571]",
    },
    {
      title: "Enterprise - Full Talent Suite",
      priceMonth: "24,000",
      priceYear: "240,000",
      isFree: false,
      comingSoon: true,
      features: [
        "Everything in Professional",
        "Expanded CV Access by Rating: - All Bronze, - Up to 03 Silver, - Up to 05 Gold, - Up to 08 Platinum",
        "Unlimited sustainability postings",
        "Choose 5 Behavioral Questions",
        "Attend carrer events (virtual, live, trade shows, education fairs)",
        "Invitation to Annual Employee Awards",
        "Send Force Job Alerts (Priority candidate reach)",
      ],
      gradient: "from-[#EDF0FF] to-[#CAD1F1]",
      textColor: "text-[#001571]",
      btnColor: "bg-[#001571] hover:bg-blue-700 text-white",
    },
  ];

  return (
    <section className="py-16 w-full flex items-center justify-center">
      <div className="pb-3 w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
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
              priceMonth={pkg.priceMonth}
              priceYear={pkg.priceYear}
              features={pkg.features}
              gradient={pkg.gradient}
              textColor={pkg.textColor}
              btnColor={pkg.btnColor}
              isFree={pkg.isFree}
              comingSoon={pkg.comingSoon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
