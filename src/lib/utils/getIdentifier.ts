/**
 * Get current page key
 *
 * @returns {{status:number,identifierData:string}}
 */
const getIdentifier = (): { status: number; identifierData: string; } => {
  let identifier: string = window.location.pathname;
  return {
    status: 200,
    identifierData: identifier,
  };
};

export default getIdentifier;
