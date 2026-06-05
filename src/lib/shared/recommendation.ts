import type { RecommendedRoom } from "~/types";

const WEIGHTS = {
  viewCount:    0.35,
  avgRating:    0.30,
  availability: 0.20,
  recency:      0.15,
} as const;

function minMax(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function recencyScore(createdAt: Date): number {
  const ageMs = Date.now() - createdAt.getTime();
  const ageWeeks = ageMs / (7 * 24 * 60 * 60 * 1000);
  return Math.exp(-ageWeeks / 4);
}

export interface ScoredRoom extends RecommendedRoom {
  score: number;
}

export function scoreRooms(rooms: Omit<RecommendedRoom, "score">[]): ScoredRoom[] {
  if (rooms.length === 0) return [];

  const views  = rooms.map((r) => r.viewCount);
  const minV   = Math.min(...views);
  const maxV   = Math.max(...views);

  const ratings = rooms.map((r) => r.avgRating);
  const minR    = Math.min(...ratings);
  const maxR    = Math.max(...ratings);

  return rooms
    .map((room) => {
      const normViews    = minMax(room.viewCount, minV, maxV);
      const normRating   = minMax(room.avgRating, minR, maxR);
      const normAvail    = room.availableCount > 0 ? room.availableCount / Math.max(room.totalCount, 1) : 0;
      const normRecency  = recencyScore(room.createdAt as unknown as Date);

      const score =
        normViews   * WEIGHTS.viewCount   +
        normRating  * WEIGHTS.avgRating   +
        normAvail   * WEIGHTS.availability +
        normRecency * WEIGHTS.recency;

      return { ...room, score: Math.round(score * 1000) / 1000 };
    })
    .sort((a, b) => b.score - a.score);
}

export function getTopRecommendations(rooms: Omit<RecommendedRoom, "score">[], limit = 8): ScoredRoom[] {
  return scoreRooms(rooms).slice(0, limit);
}
