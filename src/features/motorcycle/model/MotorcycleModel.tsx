"use client";
import { Component, type ReactNode } from "react";
import { GLBMotorcycle } from "./GLBMotorcycle";
import { ProceduralMotorcycle } from "./ProceduralMotorcycle";
import type { ModelProps } from "../types";
class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFallback: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFallback();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function MotorcycleModel(
  props: ModelProps & { onFallback: () => void },
) {
  return (
    <ModelBoundary
      onFallback={props.onFallback}
      fallback={<ProceduralMotorcycle {...props} />}
    >
      <GLBMotorcycle {...props} />
    </ModelBoundary>
  );
}
