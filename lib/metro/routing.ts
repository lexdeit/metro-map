import type { Connection, Station } from "@/types/metro";

export function findRoute(fromId: string, toId: string, stationList: Station[], connectionList: Connection[]): Station[] {
  if (fromId === toId) return stationList.filter((station) => station.id === fromId);
  const distances = new Map<string, number>(stationList.map((station) => [station.id, Infinity]));
  const previous = new Map<string, string>();
  const unvisited = new Set(stationList.map((station) => station.id));
  distances.set(fromId, 0);

  while (unvisited.size) {
    const current = [...unvisited].reduce((best, id) => (distances.get(id)! < distances.get(best)! ? id : best));
    unvisited.delete(current);
    if (distances.get(current) === Infinity || current === toId) break;
    connectionList.filter((connection) => connection.from === current || connection.to === current).forEach((connection) => {
      const neighbor = connection.from === current ? connection.to : connection.from;
      if (!unvisited.has(neighbor)) return;
      const weight = connection.dangerous ? 1.35 : 1;
      const distance = distances.get(current)! + weight;
      if (distance < distances.get(neighbor)!) {
        distances.set(neighbor, distance);
        previous.set(neighbor, current);
      }
    });
  }

  if (!previous.has(toId)) return [];
  const routeIds = [toId];
  while (routeIds[0] !== fromId) routeIds.unshift(previous.get(routeIds[0])!);
  return routeIds.map((id) => stationList.find((station) => station.id === id)!).filter(Boolean);
}
