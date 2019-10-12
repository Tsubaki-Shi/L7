import { vec2 } from 'gl-matrix';

export function computeMiter(
  tangent: vec2,
  miter: vec2,
  lineA: vec2,
  lineB: vec2,
  halfThick: number,
) {
  vec2.add(tangent, lineA, lineB);
  vec2.normalize(tangent, tangent);
  miter = vec2.fromValues(-tangent[1], tangent[0]);
  const tmp = vec2.fromValues(-lineA[1], lineA[0]);
  return halfThick / vec2.dot(miter, tmp);
}
export function computeNormal(out: vec2, dir: vec2) {
  return vec2.set(out, -dir[1], dir[0]);
}
export function direction(out: vec2, a: vec2, b: vec2) {
  vec2.sub(out, a, b);
  vec2.normalize(out, out);
  return out;
}
function extrusions(
  positions: number[],
  out: vec2,
  miters: vec2,
  point: vec2,
  normal: vec2,
  scale,
) {
  addNext(out, miters, normal, -scale);
  addNext(out, miters, normal, scale);
  positions.push(...point);
  positions.push(...point);
}

function addNext(out, miters, normal, length) {
  out.push(normal[0], normal[1], 0);
  miters.push(length);
}

function lineSegmentDistance(end, start) {
  const dx = start[0] - end[0];
  const dy = start[1] - end[1];
  const dz = start[2] - end[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isPointEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

export default function(points, closed, indexOffset) {
  const lineA = vec2.fromValues(0, 0);
  const lineB = vec2.fromValues(0, 0);
  const tangent = vec2.fromValues(0, 0);
  const miter = vec2.fromValues(0, 0);
  let _started = false;
  let _normal = null;
  const tmp = vec2.create();
  let count = indexOffset || 0;
  const miterLimit = 3;

  const out = [];
  const attrPos = [];
  const attrIndex = [];
  const miters = [];
  const attrDistance = [0, 0];
  if (closed) {
    points = points.slice();
    points.push(points[0]);
  }

  const total = points.length;

  for (let i = 1; i < total; i++) {
    const index = count;
    const last = points[i - 1];
    const cur = points[i];
    let next = i < points.length - 1 ? points[i + 1] : null;
    // 如果当前点和前一点相同，跳过
    if (isPointEqual(last, cur)) {
      continue;
    }
    if (next) {
      let nextIndex = i + 1;
      // 找到不相同的下一点
      while (next && isPointEqual(cur, next)) {
        next = nextIndex < points.length - 1 ? points[++nextIndex] : null;
      }
    }
    const lineDistance = lineSegmentDistance(cur, last);
    const d = lineDistance + attrDistance[attrDistance.length - 1];

    direction(lineA, cur, last);

    if (!_normal) {
      _normal = [0, 0];
      computeNormal(_normal, lineA);
    }

    if (!_started) {
      _started = true;
      extrusions(attrPos, out, miters, last, _normal, 1);
    }

    attrIndex.push(index + 0, index + 2, index + 1);

    // no miter, simple segment
    if (!next) {
      // reset normal
      computeNormal(_normal, lineA);
      extrusions(attrPos, out, miters, cur, _normal, 1);
      attrDistance.push(d, d);
      attrIndex.push(index + 1, index + 2, index + 3);
      count += 2;
    } else {
      // get unit dir of next line
      direction(lineB, next, cur);

      // stores tangent & miter
      let miterLen = computeMiter(tangent, miter, lineA, lineB, 1);

      // get orientation
      const flip = vec2.dot(tangent, _normal) < 0 ? -1 : 1;
      const bevel = Math.abs(miterLen) > miterLimit;

      // 处理前后两条线段重合的情况，这种情况不需要使用任何接头（miter/bevel）。
      // 理论上这种情况下 miterLen = Infinity，本应通过 isFinite(miterLen) 判断，
      // 但是 AMap 投影变换后丢失精度，只能通过一个阈值（1000）判断。
      if (Math.abs(miterLen) > 1000) {
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrIndex.push(index + 1, index + 2, index + 3);
        attrIndex.push(index + 2, index + 4, index + 3);
        computeNormal(tmp, lineB);
        vec2.copy(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d);

        // the miter is now the normal for our next join
        count += 4;
        continue;
      }

      if (bevel) {
        miterLen = miterLimit;

        // next two points in our first segment
        extrusions(attrPos, out, miters, cur, _normal, 1);

        attrIndex.push(index + 1, index + 2, index + 3);

        // now add the bevel triangle
        attrIndex.push(
          ...(flip === 1
            ? [index + 2, index + 4, index + 5]
            : [index + 4, index + 5, index + 3]),
        );

        computeNormal(tmp, lineB);
        vec2.copy(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d);

        // the miter is now the normal for our next join
        count += 4;
      } else {
        // next two points in our first segment
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrIndex.push(index + 1, index + 2, index + 3);

        // now add the miter triangles
        addNext(out, miters, miter, miterLen * -flip);
        attrPos.push(...cur);
        attrIndex.push(index + 2, index + 4, index + 3);
        attrIndex.push(index + 4, index + 5, index + 6);
        computeNormal(tmp, lineB);
        vec2.copy(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d, d);

        // the miter is now the normal for our next join
        count += 5;
      }
    }
  }

  return {
    normals: out,
    attrIndex,
    attrPos,
    attrDistance,
    miters,
  };
}
