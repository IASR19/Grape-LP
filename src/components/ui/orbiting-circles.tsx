import React from "react";

import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  paused?: boolean;
  /** Graus fixos por filho — mantém cada ícone no seu lugar ao trocar o centro. */
  itemAngles?: number[];
  /** Chaves estáveis por filho — evita reutilizar slots de animação entre pilares. */
  itemKeys?: React.Key[];
  pathClassName?: string;
}

function orbitTransform(angle: number, radius: number) {
  return `translate(-50%, -50%) rotate(${angle}deg) translateY(${radius}px) rotate(${-angle}deg)`;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  paused = false,
  itemAngles,
  itemKeys,
  pathClassName,
  ...props
}: OrbitingCirclesProps) {
  const childCount = React.Children.count(children);
  const calculatedDuration = duration / speed;
  const pathCanvas = radius * 2 + iconSize;
  const pathCenter = pathCanvas / 2;

  if (childCount === 0) {
    return null;
  }

  return (
    <div className={cn("relative size-full", className)} {...props}>
      {path ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${pathCanvas} ${pathCanvas}`}
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden
        >
          <circle
            className={cn(
              "stroke-primary-foreground/22 stroke-1 [stroke-dasharray:5_7] [stroke-linecap:round]",
              pathClassName,
            )}
            cx={pathCenter}
            cy={pathCenter}
            r={radius}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
      {React.Children.map(children, (child, index) => {
        const angle = itemAngles?.[index] ?? (360 / childCount) * index;
        const itemKey = itemKeys?.[index] ?? index;
        const baseTransform = orbitTransform(angle, radius);

        return (
          <div
            key={itemKey}
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
                ...(paused ? { transform: baseTransform } : {}),
              } as React.CSSProperties
            }
            className={cn(
              "absolute left-1/2 top-1/2 flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full",
              paused &&
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              !paused && "animate-orbit motion-reduce:animate-none",
              reverse && "[animation-direction:reverse]",
              paused && "motion-reduce:animate-none",
            )}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
