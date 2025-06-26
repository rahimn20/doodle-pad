type ElementType = "rectangle" | "circle" | "triangle" | "diamond" | "star" | "hexagon"

interface SketchElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type { ElementType, SketchElement };
