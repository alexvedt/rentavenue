import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types"; // Import PropTypes
export const VanishText = () => {
  return (
    <p className="text-base md:text-lg text-slate-700 my-4 md:my-6">
      zVenue is a platform for{" "}
      <span className="inline-block">
        <AnimatedText
          phrases={[
            "people",
            "oppurtunities",
            "marketing teams",
            "small businesses",
            "startups",
            "enterprises",
            "events",
            "conferences",
            "meetings",
            "weddings",
            "parties",
          ]}
        />
      </span>
    </p>
  );
};

const ONE_SECOND = 1000;
const WAIT_TIME = ONE_SECOND * 3;
const STAGGER = 0.025;

const AnimatedText = ({ phrases }) => {
  const countRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setActive((pv) => (pv + 1) % phrases.length);
    }, WAIT_TIME);

    return () => clearInterval(intervalRef);
  }, [phrases]);

  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-1 md:gap-1 lg:gap-1">
      <AnimatePresence mode="popLayout">
        {phrases[active].split(" ").map((word, wordIndex) => {
          if (wordIndex === 0) {
            countRef.current = 0;
          }

          return (
            <motion.div key={word} className="whitespace-nowrap text-violet-50">
              {word.split("").map((letter, letterIndex) => {
                const content = (
                  <motion.span
                    initial={{
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      delay: countRef.current * STAGGER,
                      ease: "easeInOut",
                      duration: 0.25,
                    }}
                    className="inline-block"
                    key={letterIndex}
                  >
                    {letter}
                  </motion.span>
                );

                countRef.current++;
                return content;
              })}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
AnimatedText.propTypes = {
  phrases: PropTypes.arrayOf(PropTypes.string).isRequired, // Validate that phrases is an array of strings and is required
};

export default VanishText;
