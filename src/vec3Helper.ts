import { Vec3 } from "vec3";

export function vec3ToString(position: Vec3): string {
  return `X${position.x} Y${position.y} Z${position.z}`;
}
