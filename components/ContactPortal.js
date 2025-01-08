import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-col md:flex-row justify-between my-24">
        {/* Contact Form */}
        <div className="w-full md:w-1/3 sm:2/5 lg:w-1/2 pr-10">
          <h3 className="text-blue-900 text-lg md:text-xl font-semibold mb-3">
            STILL YOU ARE IN TROUBLE? LET'S REACH US.
          </h3>
          <form>
            <label className="block">
              <input
                type="text"
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Name"
              />
            </label>
            <label className="block">
              <input
                type="email"
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Email"
              />
            </label>
            <label className="block">
              <input
                type="text"
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Contact Number"
              />
            </label>
            <label className="block">
              <input
                type="text"
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Subject"
              />
            </label>
            <label className="block mb-6 md:mb-10">
              <textarea
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Message"
                rows={7}
              />
            </label>
            <button className="bg-blue-900 text-gray-100 px-20 py-3 rounded-md">
              <span className="flex items-start justify-center">
                <Link href="/contact-us">Submit</Link>
                <img
                  src="/images/arrow.png"
                  alt="Login"
                  className="h-5 w-5 ml-5"
                />
              </span>
            </button>
          </form>
        </div>

        {/* Images Section */}
        <div className="h-[400px] md:h-auto w-full md:w-2/3 sm:w-3/5 lg:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
          <div className="flex gap-1 md:gap-4 w-full">
            <div className="relative flex-1">
              <Image
                src="/images/ppl4.png"
                alt="Person 1"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/pp3.png"
                alt="Person 2"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/pp2.png"
                alt="Person 3"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/ppl1.png"
                alt="Person 4"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
