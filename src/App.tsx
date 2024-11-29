import * as React from 'react';
import { strength, agility, intelligence, universal, heroes } from './heroes';
import './App.css';

const getInitialIdsFromUrl = (): number[] => {
  const urlParams = new URLSearchParams(window.location.search);
  const idsParam = urlParams.get('ids');

  if (idsParam) {
    return idsParam.split(',').map((id) => parseInt(id.trim()));
  }

  return [];
};

const getOverlayMode = (): 'edit' | 'overlay' => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  return mode === 'overlay' ? 'overlay' : 'edit';
};

function App() {
  const [bannedHeroIds, setBannedHeroIds] =
    React.useState<number[]>(getInitialIdsFromUrl);
  const [mode] = React.useState(getOverlayMode);

  const handleClick = (id: number) => {
    const isBanned = bannedHeroIds.includes(id);

    if (isBanned) {
      setBannedHeroIds((bannedIds) =>
        bannedIds.filter((bannedId) => bannedId !== id)
      );
    } else {
      setBannedHeroIds((bannedIds) => [...bannedIds, id]);
    }
  };

  const handleCopyToClipboard = () => {
    const url = getOverlayUrl(bannedHeroIds);

    navigator.clipboard.writeText(url.toString());
  };

  const isEditMode = mode !== 'overlay';

  return isEditMode ? (
    <div className="edit-mode-wrapper">
      <div className="captains-mode-bg" />

      <div className="action-wrapper">
        <button onClick={() => setBannedHeroIds([])}>Clear selection</button>
        <button className="copy-url-button" onClick={handleCopyToClipboard}>
          Copy overlay URL
        </button>
        <a href={getOverlayUrl(bannedHeroIds)}>Link to Overlay</a>
      </div>

      <div className="overlay">
        <div className="hero-section">
          {strength.map((hero) => (
            <div
              key={hero.id}
              className={
                bannedHeroIds.includes(hero.id)
                  ? 'hero-avatar is-banned'
                  : 'hero-avatar'
              }
              onClick={() => handleClick(hero.id)}
            ></div>
          ))}
        </div>

        <div className="hero-section">
          {agility.map((hero) => (
            <div
              key={hero.id}
              className={
                bannedHeroIds.includes(hero.id)
                  ? 'hero-avatar is-banned'
                  : 'hero-avatar'
              }
              onClick={() => handleClick(hero.id)}
            ></div>
          ))}
        </div>

        <div className="hero-section">
          {intelligence.map((hero) => (
            <div
              key={hero.id}
              className={
                bannedHeroIds.includes(hero.id)
                  ? 'hero-avatar is-banned'
                  : 'hero-avatar'
              }
              onClick={() => handleClick(hero.id)}
            ></div>
          ))}
        </div>

        <div className="hero-section">
          {universal.map((hero) => (
            <div
              key={hero.id}
              className={
                bannedHeroIds.includes(hero.id)
                  ? 'hero-avatar is-banned'
                  : 'hero-avatar'
              }
              onClick={() => handleClick(hero.id)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <OverlayView />
  );
}

const getOverlayUrl = (bannedHeroIds: number[]) => {
  const url = new URL(window.location.href);

  url.searchParams.set('ids', bannedHeroIds.join(','));
  url.searchParams.set('mode', 'overlay');

  return url.toString();
};

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

const OverlayView = () => {
  const [bannedHeroIds] = React.useState<number[]>(getInitialIdsFromUrl);
  const chunkedIds = sliceArray(bannedHeroIds);

  const navigateToEdit = () => {
    const url = window.location.href;

    const urlObj = new URL(url);
    if (urlObj.searchParams.get('mode') === 'overlay') {
      urlObj.searchParams.set('mode', 'edit');
    }

    window.location.href = urlObj.toString();
  };

  return (
    <>
      <div className="click-overlay" onClick={navigateToEdit} />
      <div>
        {chunkedIds.map((chunk, i) => (
          <div key={i} className="ban-column">
            {chunk.map((id) => (
              <div key={id} className="ban-avatar">
                <img src={getIconPath(lookupObject[id].name)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

const getIconPath = (name: string) => {
  return `${name.replace(' ', '_')}_icon.webp`;
};

export default App;
