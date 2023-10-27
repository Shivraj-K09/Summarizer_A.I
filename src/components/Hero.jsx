import { ChevronRight } from "lucide-react";
import { logo } from "../assets";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

const Hero = () => (
  <div className="w-full flex justify-center items-center flex-col">
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-center items-center w-full pt-3">
        <img src={logo} alt="Logo sumz" className="w-28 object-contain" />
      </nav>
    </header>

    <div className="flex md:flex-col items-center justify-center  min-h-screen md:-mt-20">
      <h1 className="head_text">
        Article{" "}
        <TypeAnimation
          sequence={["Summarize", 4000, "Extract", 4000]}
          wrapper="span"
          speed={30}
          cursor={false}
          repeat={Infinity}
        />{" "}
        Made
        <br className="max-md:hidden" />
        <span className="orange_gradient"> Easy with AI</span>
      </h1>

      <h2 className="desc">
        Effortless Reading Made Simple: Summarize, Your Open-Source Tool,
        Transforms Complex Articles Into Easy-to-Understand Digests.
      </h2>

      <Link
        to="/demo"
        type="button"
        className="md:mt-10 px-8 py-4 rounded-[30px] border-black/40 box-shadow-btn border font-bold flex items-center justify-center"
      >
        {`Get Started`} <ChevronRight />
      </Link>
    </div>
  </div>
);

export default Hero;
