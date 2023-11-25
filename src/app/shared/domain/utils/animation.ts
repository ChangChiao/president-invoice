import { Elastic, gsap } from 'gsap';
import { wait } from './wait';

export const gsapZoom = async (
  target: string,
  action: Record<string, unknown>
) => {
  const tl = gsap.timeline();
  tl.to(target, { ease: Elastic.easeInOut, duration: 0.5, ...action });
  await wait(1000);
  tl.reverse();
};
