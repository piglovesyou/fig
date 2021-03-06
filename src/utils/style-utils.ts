import findLast from 'lodash.findlast';
import { Color, EffectShadow, Paint, PaintSolidScaleMode } from '../types/ast';

// const vectorTypes = [
//   'VECTOR',
//   'LINE',
//   'REGULAR_POLYGON',
//   'ELLIPSE',
//   'STAR',
//   'SHAPE',
// ];

// export function isVector(node: ComposableNode) {
//   return vectorTypes.includes(node.type);
// }

// const GROUP_TYPES = ['GROUP', 'BOOLEAN_OPERATION'];

function expand256(color: number) {
  return Math.round(color * 255);
}

function toColorHex(c: number): string {
  const s = c.toString(16);
  if (s.length === 1) return `${s}${s}`;
  return s;
}

export function colorString(color?: Color) {
  if (!color) {
    console.warn('!!!color can be undefined!!!');
    return 'transparent';
  }
  const r = expand256(color.r);
  const g = expand256(color.g);
  const b = expand256(color.b);
  if (color.a === 1) {
    return `#${toColorHex(r)}${toColorHex(g)}${toColorHex(b)}`;
  }
  return `rgba(${r}, ${g}, ${b}, ${color.a})`;
}

export function dropShadow(effect: EffectShadow) {
  return `${effect.offset.x}px ${effect.offset.y}px ${
    effect.radius
  }px ${colorString(effect.color)}`;
}

export function innerShadow(effect: EffectShadow) {
  return `inset ${effect.offset.x}px ${effect.offset.y}px ${
    effect.radius
  }px ${colorString(effect.color)}`;
}

// export function imageURL(hash: string) {
//   const squash = hash.split('-').join('');
//   return `url(https://s3-us-west-2.amazonaws.com/figma-alpha/img/${squash.substring(
//     0,
//     4
//   )}/${squash.substring(4, 8)}/${squash.substring(8)})`;
// }

export function backgroundSize(scaleMode: PaintSolidScaleMode) {
  if (scaleMode === 'FILL') {
    return 'cover';
  }
}

// export function sortByYAxis(a: ComposableNode, b: ComposableNode): number {
//   return a.absoluteBoundingBox.y - b.absoluteBoundingBox.y;
// }

export function getLastVisible<T>(arra: T[]): T | null {
  // @ts-ignore
  return findLast(arra, (e: any) => e.visible != false);
}

export function paintToLinearGradient(paint: Paint) {
  const handles = paint.gradientHandlePositions || [];
  const handle0 = handles[0];
  const handle1 = handles[1];

  const ydiff = handle1.y - handle0.y;
  const xdiff = handle0.x - handle1.x;

  const angle = Math.atan2(-xdiff, -ydiff);
  const stops = (paint.gradientStops || [])
    .map((stop) => {
      return `${colorString(stop.color)} ${Math.round(stop.position * 100)}%`;
    })
    .join(', ');
  return `linear-gradient(${angle}rad, ${stops})`;
}

export function paintToRadialGradient(paint: Paint) {
  const stops = (paint.gradientStops || [])
    .map((stop) => {
      return `${colorString(stop.color)} ${Math.round(stop.position * 60)}%`;
    })
    .join(', ');

  return `radial-gradient(${stops})`;
}
