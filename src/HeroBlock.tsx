type HeroBlockProps = {
  heroes: Hero[];
};

type Hero = {
  name: string;
  id: number;
};

export const HeroBlock = (props: HeroBlockProps) => {
  return (
    <div className="hero-section">
      {props.heroes.map(hero => (
        <HeroAvatar key={hero.id} hero={hero} />
      ))}
    </div>
  );
};

type HeroAvatarProps = {
  hero: Hero;
};

const HeroAvatar = (props: HeroAvatarProps) => {
  return (
    <div className="hero-avatar">
      <span>{props.hero.name}</span>
    </div>
  );
};
