import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Path, G } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

// ── Constants ────────────────────────────────────────────────
const ACCENT = "#8B5CF6";
const ILLUS   = 280;
const CX      = ILLUS / 2; // 140
const CY      = ILLUS / 2; // 140

const G_R  = 86;   // globe radius
const P_R  = 116;  // plane orbit radius
const PH_W = 54;   // phone width
const PH_H = 92;   // phone height
const PL_S = 22;   // plane bounding box size

// ── Pre-calculate plane orbit (120 steps) ────────────────────
const N = 120;
const tArr  = Array.from({ length: N + 1 }, (_, i) => i / N);
const pXArr = tArr.map((t) => P_R * Math.cos(t * 2 * Math.PI - Math.PI / 2));
const pYArr = tArr.map((t) => P_R * Math.sin(t * 2 * Math.PI - Math.PI / 2));
// Tangent rotation: at angle θ the nose points at θ+90°
const pRArr = tArr.map((t) => {
  const θ = t * 2 * Math.PI - Math.PI / 2;
  return `${((θ + Math.PI / 2) * 180) / Math.PI}deg`;
});

// ── Latitude ellipse params ──────────────────────────────────
const LAT_FRACS = [-0.65, -0.38, 0, 0.38, 0.65];
// Longitude: num visually distinct meridians
const LON_COUNT = 6;

// ── Leaf branch SVG ──────────────────────────────────────────
function LeafBranch({ flip }: { flip: 1 | -1 }) {
  const s  = flip; // 1 = left side, -1 = right (mirrored)
  const cx = 30;
  const cy = 80;
  return (
    <Svg width={60} height={80} viewBox="0 0 60 80">
      {/* Stem */}
      <Path
        d={`M ${cx} ${cy} Q ${cx + s * 12} 52 ${cx + s * 22} 26`}
        stroke={ACCENT}
        strokeWidth={1.4}
        fill="none"
        opacity={0.55}
      />
      {/* Leaf 1 — lowest */}
      <Path
        d={`M ${cx + s * 8} 62 Q ${cx + s * 26} 48 ${cx + s * 22} 32 Q ${cx + s * 2} 52 ${cx + s * 8} 62 Z`}
        fill={ACCENT}
        opacity={0.22}
      />
      {/* Leaf 2 — mid */}
      <Path
        d={`M ${cx + s * 12} 46 Q ${cx + s * 28} 30 ${cx + s * 20} 14 Q ${cx - s * 2} 34 ${cx + s * 12} 46 Z`}
        fill={ACCENT}
        opacity={0.32}
      />
      {/* Leaf 3 — top */}
      <Path
        d={`M ${cx + s * 18} 30 Q ${cx + s * 30} 14 ${cx + s * 22} 2 Q ${cx + s * 4} 18 ${cx + s * 18} 30 Z`}
        fill={ACCENT}
        opacity={0.42}
      />
    </Svg>
  );
}

// ── Main component ───────────────────────────────────────────
export default function ESIMIllustration() {
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const globeRot   = useRef(new Animated.Value(0)).current;
  const planeProg  = useRef(new Animated.Value(0)).current;
  const leafSway   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Float — entire illustration bobs 4px up/down, 2.7s half-cycle
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -4, duration: 2700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  4, duration: 2700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    // 2. Globe — one 360° rotation every 50s
    const globeLoop = Animated.loop(
      Animated.timing(globeRot, { toValue: 1, duration: 50000, easing: Easing.linear, useNativeDriver: true })
    );

    // 3. Plane — one orbit every 13s
    const planeLoop = Animated.loop(
      Animated.timing(planeProg, { toValue: 1, duration: 13000, easing: Easing.linear, useNativeDriver: true })
    );

    // 4. Leaf sway — ±1 over 2s each direction
    const leafLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(leafSway, { toValue:  1, duration: 2100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(leafSway, { toValue: -1, duration: 2100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    floatLoop.start();
    globeLoop.start();
    planeLoop.start();
    leafLoop.start();

    return () => {
      floatLoop.stop();
      globeLoop.stop();
      planeLoop.stop();
      leafLoop.stop();
    };
  }, []);

  // Derived animated values
  const globeRotDeg = globeRot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  const planeX   = planeProg.interpolate({ inputRange: tArr, outputRange: pXArr });
  const planeY   = planeProg.interpolate({ inputRange: tArr, outputRange: pYArr });
  const planeRot = planeProg.interpolate({ inputRange: tArr, outputRange: pRArr });

  const lLeafRot = leafSway.interpolate({ inputRange: [-1, 0, 1], outputRange: ["-3.5deg", "-0.5deg", "3.5deg"] });
  const rLeafRot = leafSway.interpolate({ inputRange: [-1, 0, 1], outputRange: ["3.5deg",  "0.5deg", "-3.5deg"] });
  const lLeafY   = leafSway.interpolate({ inputRange: [-1, 0, 1], outputRange: [1.5, 0, -1.5] });
  const rLeafY   = leafSway.interpolate({ inputRange: [-1, 0, 1], outputRange: [-1.5, 0, 1.5] });

  return (
    <Animated.View style={[s.wrapper, { transform: [{ translateY: floatAnim }] }]}>

      {/* ── Flight path (behind globe and phone) ── */}
      <View style={s.pathOverlay} pointerEvents="none">
        <Svg width={ILLUS} height={ILLUS}>
          <Circle
            cx={CX} cy={CY} r={P_R}
            stroke={`${ACCENT}50`}
            strokeWidth={1.5}
            strokeDasharray="6 9"
            fill="none"
          />
        </Svg>
      </View>

      {/* ── Globe (clipped circle + rotating grid) ── */}
      <View style={s.globeClip}>
        {/* Background */}
        <View style={s.globeBg} />

        {/* Rotating grid lines */}
        <Animated.View style={[s.gridLayer, { transform: [{ rotate: globeRotDeg }] }]}>
          <Svg width={G_R * 2} height={G_R * 2}>
            {/* Latitude lines */}
            {LAT_FRACS.map((f, i) => {
              const cy = G_R + f * G_R;
              const rx = G_R * Math.sqrt(Math.max(0, 1 - f * f));
              const ry = rx * 0.28;
              return rx > 1 ? (
                <Ellipse
                  key={`lat-${i}`}
                  cx={G_R} cy={cy} rx={rx} ry={ry}
                  stroke={`${ACCENT}40`} strokeWidth={0.9} fill="none"
                />
              ) : null;
            })}

            {/* Longitude lines (6 meridians, each an ellipse at different x-compression) */}
            {Array.from({ length: LON_COUNT }, (_, i) => {
              const angle  = (i / LON_COUNT) * Math.PI;
              const rxComp = Math.abs(Math.sin(angle));
              return rxComp > 0.05 ? (
                <Ellipse
                  key={`lon-${i}`}
                  cx={G_R} cy={G_R}
                  rx={G_R * rxComp} ry={G_R}
                  stroke={`${ACCENT}35`} strokeWidth={0.9} fill="none"
                />
              ) : null;
            })}

            {/* Central meridian line */}
            <Ellipse
              cx={G_R} cy={G_R} rx={0.8} ry={G_R}
              stroke={`${ACCENT}50`} strokeWidth={0.9} fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Subtle highlight lens */}
        <View style={s.globeLens} />
      </View>

      {/* ── Globe outer glow ring ── */}
      <View style={s.globeRing} />

      {/* ── Phone sits centered on globe ── */}
      <View style={s.phone}>
        {/* Camera notch */}
        <View style={s.phoneNotch} />
        {/* Screen */}
        <View style={s.phoneScreen}>
          {/* Signal bars icon */}
          <Feather name="wifi" size={18} color={ACCENT} />
          {/* Small signal lines */}
          <View style={s.simLabel}>
            <View style={[s.simDot, { backgroundColor: `${ACCENT}CC` }]} />
            <View style={s.simLine} />
          </View>
        </View>
        {/* Home bar */}
        <View style={s.phoneBar} />
      </View>

      {/* ── Animated plane on orbit ── */}
      <Animated.View
        style={[
          s.planeWrap,
          {
            transform: [
              { translateX: planeX },
              { translateY: planeY },
              { rotate: planeRot },
            ],
          },
        ]}
      >
        <Svg width={PL_S} height={PL_S} viewBox="0 0 24 24">
          {/* Plane body */}
          <Path d="M12 2 L15.5 10.5 L12 8.5 L8.5 10.5 Z" fill={ACCENT} />
          {/* Wings */}
          <Path d="M8 9.5 L3.5 14 L12 11.5 L20.5 14 L16 9.5 Z" fill={ACCENT} opacity={0.75} />
          {/* Tail */}
          <Path d="M9.5 17 L12 11.5 L14.5 17 L12 16 Z" fill={ACCENT} opacity={0.55} />
        </Svg>
      </Animated.View>

      {/* ── Signal pulse dots around globe ── */}
      {[30, 120, 210, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dotR = G_R + 12;
        return (
          <View
            key={i}
            style={[
              s.signalDot,
              {
                left: CX + dotR * Math.cos(rad) - 3,
                top:  CY + dotR * Math.sin(rad) - 3,
              },
            ]}
          />
        );
      })}

      {/* ── Leaf branches ── */}
      <Animated.View
        style={[
          s.leafLeft,
          { transform: [{ rotate: lLeafRot }, { translateY: lLeafY }] },
        ]}
      >
        <LeafBranch flip={1} />
      </Animated.View>
      <Animated.View
        style={[
          s.leafRight,
          { transform: [{ rotate: rLeafRot }, { translateY: rLeafY }] },
        ]}
      >
        <LeafBranch flip={-1} />
      </Animated.View>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  wrapper: {
    width:  ILLUS,
    height: ILLUS,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Flight path SVG overlay
  pathOverlay: {
    position: "absolute",
    width:  ILLUS,
    height: ILLUS,
    top: 0,
    left: 0,
  },

  // Globe clipped circle
  globeClip: {
    position:     "absolute",
    width:        G_R * 2,
    height:       G_R * 2,
    borderRadius: G_R,
    overflow:     "hidden",
    left:         CX - G_R,
    top:          CY - G_R,
  },
  globeBg: {
    position:        "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#190E35",
  },
  gridLayer: {
    position: "absolute",
    width:    G_R * 2,
    height:   G_R * 2,
    top: 0,
    left: 0,
  },
  globeLens: {
    position:        "absolute",
    width:           G_R * 0.55,
    height:          G_R * 0.55,
    borderRadius:    G_R * 0.28,
    backgroundColor: "rgba(220,210,255,0.055)",
    top:  G_R * 0.14,
    left: G_R * 0.12,
  },

  // Globe outer ring (outside clip — so border is visible)
  globeRing: {
    position:     "absolute",
    width:        G_R * 2,
    height:       G_R * 2,
    borderRadius: G_R,
    borderWidth:  1.2,
    borderColor:  `${ACCENT}55`,
    left:         CX - G_R,
    top:          CY - G_R,
  },

  // Phone
  phone: {
    width:           PH_W,
    height:          PH_H,
    backgroundColor: "#0C0920",
    borderRadius:    14,
    borderWidth:     1.5,
    borderColor:     `${ACCENT}70`,
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingTop:      8,
    paddingBottom:   8,
    paddingHorizontal: 4,
  },
  phoneNotch: {
    width:           18,
    height:          4,
    borderRadius:    2,
    backgroundColor: `${ACCENT}55`,
  },
  phoneScreen: {
    flex:            1,
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "#1A1040",
    borderRadius:    10,
    marginHorizontal: 4,
    marginTop:       4,
    gap:             6,
  },
  simLabel: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  simDot: {
    width:        4,
    height:       4,
    borderRadius: 2,
  },
  simLine: {
    width:           14,
    height:          1.5,
    borderRadius:    1,
    backgroundColor: `${ACCENT}50`,
  },
  phoneBar: {
    width:           20,
    height:          3,
    borderRadius:    2,
    backgroundColor: `${ACCENT}50`,
  },

  // Plane
  planeWrap: {
    position: "absolute",
    left:     CX - PL_S / 2,
    top:      CY - PL_S / 2,
  },

  // Signal pulse dots
  signalDot: {
    position:        "absolute",
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: `${ACCENT}60`,
  },

  // Leaves
  leafLeft: {
    position: "absolute",
    bottom:   4,
    left:     6,
  },
  leafRight: {
    position: "absolute",
    bottom:   4,
    right:    6,
  },
});
