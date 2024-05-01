/**
 * @param classes Tailwind CSS class strings as arguments
 * @returns A space separated list of classes,
 * or an empty string if no classes are available.
 */
export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}
