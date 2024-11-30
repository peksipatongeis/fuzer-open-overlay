import * as React from 'react';
import { heroes } from './heroes';
import { useChannel } from 'ably/react';

type Hero = {
  name: string;
  id: number;
};

const lookupObject: { [id: string]: Hero } = Object.values(heroes).reduce(
  (acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  },
  {} as { [id: string]: Hero }
);

function sliceArray<T>(
  arr: T[],
  maxSize: number = 5,
  maxTotal: number = 20
): T[][] {
  // Ensure the array is sliced into chunks of maxSize, but limit the total number of items
  const totalItemsToInclude = Math.min(arr.length, maxTotal);
  const result: T[][] = [];

  for (let i = 0; i < totalItemsToInclude; i += maxSize) {
    result.push(arr.slice(i, i + maxSize));
  }

  return result;
}

export const OverlayView = () => {
  const [bannedHeroIds, setBannedHeroIds] = React.useState<number[]>([]);
  const chunkedIds = sliceArray(bannedHeroIds);

  useChannel('fuzer-open-overlay', 'hero-bans', bannedHeroIds => {
    setBannedHeroIds(bannedHeroIds.data as number[]);
  });

  return (
    <div>
      {chunkedIds.map((chunk, i) => (
        <div key={i} className="ban-column">
          {chunk.map(id => (
            <div key={id} className="ban-avatar">
              <img src={getIconPath(lookupObject[id].name)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const getIconPath = (name: string) => {
  return `${name.replace(' ', '_')}_icon.webp`;
};
