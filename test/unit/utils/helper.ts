import { Point, Polygon } from "geojson";


export function createPoint(longitude: number, latitude: number) {
    return {
      type: "Point",
      coordinates: [longitude, latitude],
    } as Point;
}

export function createPolygon(coordinates: number[][]) {
    return {
          type: "Polygon",
          coordinates: [coordinates],
        } as Polygon
}