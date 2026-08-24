# Hero model slot

Drop the slide-deck 3D export here as `trellis-hero.glb`.

Then open `src/components/hero/HeroScene.tsx` and flip:

```ts
const USE_HERO_MODEL = false;
```

to `true`. `HeroModel` (in `src/components/hero/HeroModel.tsx`) will load and
render it automatically — no other code changes needed. Until then, the
procedural response-surface animation is the working default.
