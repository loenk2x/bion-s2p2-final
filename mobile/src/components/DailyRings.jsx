// React Native twin of web/src/components/DailyRings.jsx. All geometry comes
// from buildRings() (@shared/rings) - this component only draws it with
// react-native-svg instead of inline <svg>.
//
// Pulse animation: web uses a CSS keyframe (1 -> 1.045 -> 1 over 3.6s) with
// per-ring negative animation-delay values from PULSE_DELAYS so the three
// rings don't pulse in lockstep. React Native's Animated has no equivalent
// of a negative delay (which starts a loop already partway through its
// cycle) - only forward delays before a loop starts. A negative delay is
// equivalent to a forward delay of (cycle + negativeDelay), since the cycle
// repeats forever; that mapping is used below to reproduce the same stagger.
//
// Turned off entirely when the system's reduce-motion setting is on, per
// RENCANA-MOBILE.md section 4 (Langkah 5) and matching the web app's
// behaviour under prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import { buildRings, RING_CANVAS } from "@shared/rings";
import { formatInteger, formatDecimal } from "@shared/format";
import { IconGlyph } from "./Icon";
import { colors, spacing } from "../theme/colors";

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);
const PULSE_CYCLE_MS = 3600;
const PULSE_SCALE = 1.045;

function pulseDelayMs(cssDelay) {
  // "-1.2s" -> -1200ms -> forward-delay equivalent (3600 + -1200) % 3600 = 2400ms
  const ms = parseFloat(cssDelay) * 1000;
  return ((ms % PULSE_CYCLE_MS) + PULSE_CYCLE_MS) % PULSE_CYCLE_MS;
}

function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);
  return reduceMotion;
}

function PulsingRing({ ring }) {
  const reduceMotion = useReduceMotion();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.stopAnimation();
    scale.setValue(0);
    if (reduceMotion) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: PULSE_CYCLE_MS / 2, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 0, duration: PULSE_CYCLE_MS / 2, useNativeDriver: false })
      ])
    );
    const timer = setTimeout(() => loop.start(), pulseDelayMs(ring.pulseDelay));
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [reduceMotion, ring.pulseDelay, scale]);

  const animatedRadius = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [ring.radius, ring.radius * PULSE_SCALE]
  });

  return <AnimatedCircle cx={ring.cx} cy={ring.cy} r={animatedRadius} fill={ring.hex} opacity={0.8} />;
}

export default function DailyRings({ rings: ringsSummary }) {
  const rings = buildRings(ringsSummary);

  return (
    <View style={styles.card}>
      <Svg width={RING_CANVAS.width} height={RING_CANVAS.height} viewBox={`0 0 ${RING_CANVAS.width} ${RING_CANVAS.height}`}>
        {rings.map((ring) => (
          <SvgCircle
            key={`shadow-${ring.key}`}
            cx={ring.cx}
            cy={ring.cy}
            r={ring.targetRadius}
            fill={ring.hex}
            fillOpacity={0.1}
            stroke={ring.hex}
            strokeOpacity={0.28}
            strokeWidth={1.5}
          />
        ))}
        {rings.map((ring) => (
          <PulsingRing key={`active-${ring.key}`} ring={ring} />
        ))}
        {rings.map((ring) => (
          <IconGlyph key={`icon-${ring.key}`} name={ring.icon} size={22} color={colors.putih} x={ring.cx - 11} y={ring.cy - 11} />
        ))}
      </Svg>
      <View style={styles.legend}>
        {rings.map((ring) => {
          const isDecimal = ring.key === "tidur";
          const format = isDecimal ? formatDecimal : formatInteger;
          return (
            <View key={ring.key} style={styles.legendItem}>
              <View style={styles.legendLabelRow}>
                <View style={[styles.dot, { backgroundColor: ring.hex }]} />
                <Text style={styles.legendLabel}>{ring.label}</Text>
              </View>
              <Text style={styles.legendValue}>
                {format(ring.achieved)}
                <Text style={styles.legendTarget}>/{format(ring.target)}</Text>
              </Text>
              <Text style={styles.legendUnit}>{ring.unit}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", gap: spacing.s12 },
  legend: { flexDirection: "row", gap: spacing.s16 },
  legendItem: { alignItems: "center" },
  legendLabelRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: colors.tinta600 },
  legendValue: { fontSize: 16, fontWeight: "700", color: colors.tinta900 },
  legendTarget: { fontSize: 12, fontWeight: "400", color: colors.tinta400 },
  legendUnit: { fontSize: 10, color: colors.tinta400 }
});
