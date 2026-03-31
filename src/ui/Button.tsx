import React from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const VARIANT_CLASSES = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  ghost:
    'text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-blue-500 dark:hover:bg-gray-800',
  link: 'text-blue-600 hover:text-blue-700 hover:underline focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-blue-400 dark:hover:text-blue-300',
} as const;

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
} as const;

const UNSIZED_VARIANTS: ReadonlyArray<IButtonProps['variant']> = ['link', 'ghost'];

/**
 * A reusable button component with multiple variants and sizes.
 */
export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(function Button(
  { variant = 'primary', size = 'md', children, className = '', ...rest },
  ref,
) {
  const sizeClass = UNSIZED_VARIANTS.includes(variant) ? '' : SIZE_CLASSES[size];
  return (
    <button
      ref={ref}
      type="button"
      className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});
