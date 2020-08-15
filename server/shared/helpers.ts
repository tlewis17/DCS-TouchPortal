/**
 * Sleeps for specified number of milliseconds
 *
 * @export
 * @param ms The number of milliseconds to sleep
 */
export function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
