/* Motion switch.

   STATIC=1 renders every panel in its settled state with no animation classes.
   Two uses: design review, where a screenshot otherwise captures frame zero of
   a draw-in, and a sanity check that the panel is complete and correct when
   nothing moves (which is exactly what a reduced-motion viewer sees). */

export const STATIC = process.env.STATIC === '1';

/** Emits a class attribute only when motion is on. */
export function cls(name: string): string | undefined {
  return STATIC ? undefined : name;
}
