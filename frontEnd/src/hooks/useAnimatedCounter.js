import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const frameRef = useRef(null);

  useEffect(() => {
    if (end === start) {
      setCount(start);
      return;
    }

    const startTime = performance.now();
    countRef.current = start;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);

      if (current !== countRef.current) {
        countRef.current = current;
        setCount(current);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start]);

  return count;
}
