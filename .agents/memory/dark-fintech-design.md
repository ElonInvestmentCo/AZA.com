---
name: Dark fintech design system
description: Complete dark palette + Reanimated 3 animation conventions for AZA/PAYVORA mobile app.
---

## Design tokens (constants/colors.ts → colors.light)
background:#0A0A0F, surface:#14141F, card:#1C1C2A, border:#2A2A3D
primary/accent:#00D9A0, primaryForeground:#0A0A0F
accentDim:rgba(0,217,160,0.12), accentGlow:rgba(0,217,160,0.22)
destructive:#FF5B7A, destructiveDim:rgba(255,91,122,0.12)
inputBorder:#2A2A3D, inputFocus:#00D9A0
mutedForeground:#8F8FA3, placeholder:#55556A
successLight:rgba(0,217,160,0.12), warningLight:rgba(245,158,11,0.14)

Why: useColors() returns colors.light — keeping the light key preserves hook compat.

## Fonts loaded in _layout.tsx
Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold — all safe.

## Reanimated 3 conventions
Button press: withSpring(0.96/1.0, { damping:14, stiffness:320 })
Screen entrance: FadeInDown.duration(420).springify() for header
Content sections: FadeInUp.duration(380).springify().delay(N*ms)
List rows: FadeInRight.duration(320).springify().delay(i*40)
Success icon: withSequence(withSpring(1.3,d:7,s:180), withSpring(1.0,d:14,s:180))
Use Easing.sin NOT Easing.sine

## DO NOT TOUCH
- app/(auth)/login.tsx — reference design, own local C constants
- app/onboarding.tsx — white bg intentional
- app/index.tsx — PAYVORA splash screen

## Auth screens pattern
register.tsx uses local C constants + inline FinInput (matches login.tsx style).
Other auth screens use AZAInput + AZAButton + ScreenHeader shared components.
