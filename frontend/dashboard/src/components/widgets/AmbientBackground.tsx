"use client";

import { useEffect, useState } from "react";
import styles from "./AmbientBackground.module.css";
import { useSensorData } from "@/contexts/sensor-data";

function computeTheme(
  acState: boolean | undefined,
  currentTemp: number | undefined,
): string {
  if (!acState) return styles.fondoDefault;
  if (currentTemp !== undefined && currentTemp <= 20) return styles.fondoFrio;
  if (currentTemp !== undefined && currentTemp <= 27) return styles.fondoCalido1;
  return styles.fondoCalido2;
}

const THEME_BG: Record<string, string> = {
  [styles.fondoFrio]: "#0c4a6e",
  [styles.fondoCalido1]: "#5a4633",
  [styles.fondoCalido2]: "#6b3f2a",
  [styles.fondoDefault]: "#020617",
};

export function AmbientBackground() {
  const { data } = useSensorData();
  const sensor = data?.data?.sensor;
  const theme = computeTheme(sensor?.ac_state, sensor?.avg_temperature);

  const [prev, setPrev] = useState<string | null>(null);
  const [current, setCurrent] = useState(theme);

  if (theme !== current) {
    setPrev(current);
    setCurrent(theme);
  }

  useEffect(() => {
    const color = THEME_BG[current] ?? THEME_BG[styles.fondoDefault];
    document.documentElement.style.backgroundColor = color;
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, [current]);

  return (
    <>
      {prev && <div className={`${styles.pageContainer} ${prev}`} />}
      <div
        className={`${styles.pageContainer} ${current} ${styles.bgFadeIn}`}
        onAnimationEnd={() => setPrev(null)}
      />
    </>
  );
}