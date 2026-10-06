/**
 * PillButton — the template's pill control.
 *
 * An outlined capsule with wide-tracked uppercase text and a colour-swap
 * hover: a fill slides up from the bottom edge, swapping the button's
 * background and text colours (teal→deep-teal on solid, plum→deep-plum on
 * plum, ink-fill with cream text on outline).
 *
 * By default it is inert (aria-disabled, no cursor affordance) for actions
 * with no destination yet. Pass `interactive` on buttons that DO act — e.g.
 * opening the consultation overlay — and/or an `onClick` via `...rest`.
 */
export default function PillButton({
  children,
  tone = 'outline',
  size = 'md',
  className = '',
  arrow = false,
  interactive = false,
  ...rest
}) {
  // Rest state classes, and the colour the fill becomes on hover.
  const tones = {
    outline: 'border-ink/25 text-ink',
    solid: 'border-teal-800 bg-teal-800 text-cream',
    light: 'border-cream/35 text-cream',
    plum: 'border-plum-800 bg-plum-800 text-cream',
  };

  // The swapped pair: [fill colour that slides up, text colour on top of it].
  // Full literal class strings — Tailwind generates utilities only for class
  // names it can see in the source, so nothing here may be assembled at runtime.
  const swaps = {
    outline: ['bg-ink', 'group-hover:text-cream'],
    solid: ['bg-cream', 'group-hover:text-teal-800'],
    light: ['bg-cream/10', 'group-hover:text-cream'],
    plum: ['bg-teal-800', 'group-hover:text-cream'],
  };

  const sizes = {
    sm: 'px-6 py-3 text-[0.625rem]',
    md: 'px-8 py-4 text-[0.6875rem]',
    lg: 'px-10 py-5 text-xs',
  };

  const [fill, fillText] = swaps[tone];

  return (
    <button
      type="button"
      {...(interactive
        ? {}
        : {
            'aria-disabled': 'true',
            title: 'This action opens in a later stage',
          })}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${
        interactive ? '' : 'cursor-default select-none'
      } ${tones[tone]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {/* Fill wipes up from the bottom on hover, swapping the colours */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 ${fill}`}
      />
      <span className={`relative z-10 transition-colors duration-500 ${fillText}`}>
        {children}
      </span>
      {arrow ? (
        <span
          aria-hidden="true"
          className={`relative z-10 transition-transform duration-500 ${fillText} group-hover:translate-x-1`}
        >
          &rarr;
        </span>
      ) : null}
    </button>
  );
}
