import * as React from 'react';
import { strength, agility, intelligence, universal } from './heroes';
import { useChannel } from 'ably/react';
import { useLocalStorage } from '@uidotdev/usehooks';

export const EditMode = () => {
  const [bannedHeroIds, setBannedHeroIds] = useLocalStorage<number[]>(
    'hero-bans',
    []
  );

  const handleClick = (id: number) => {
    const isBanned = bannedHeroIds.includes(id);

    if (isBanned) {
      setBannedHeroIds(bannedIds =>
        bannedIds.filter(bannedId => bannedId !== id)
      );
    } else {
      setBannedHeroIds(bannedIds => [...bannedIds, id]);
    }
  };

  const { channel } = useChannel('fuzer-open-overlay', 'hero-bans');

  React.useEffect(() => {
    channel.publish('hero-bans', bannedHeroIds);
  }, [bannedHeroIds, channel]);

  const handleUrlCopy = async () => {
    const url = window.location.href + '?mode=overlay';

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-mode-wrapper">
      <div className="captains-mode-bg" />

      <div className="action-wrapper">
        <button onClick={() => setBannedHeroIds([])}>Clear selection</button>
        <button onClick={handleUrlCopy}>Copy overlay view URL</button>
      </div>

      <div className="overlay">
        <div className="hero-section">
          {strength.map(hero => (
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
          {agility.map(hero => (
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
          {intelligence.map(hero => (
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
          {universal.map(hero => (
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
  );
};
