import moment from 'moment';
import _ from 'lodash';

import Pot from '../components/Pot';

export const Web3Helper = (web3) => {
  return {
    fromWei: (wei, decimal = 3) => {
      let res = web3.utils.fromWei(wei, "ether");
      return Number.parseFloat(res).toFixed(decimal);
    },
    cmp: (wei, num) => {
      return web3.utils.toBN(wei).cmp(web3.utils.toBN(num));
    }
  };
}

// Used to replace javascript native switch-case statement
// Ref: http://bit.ly/2JxzUo4
const matched = (x) => ({
  on: (pred, fn) => matched(x),
  otherwise: (fn) => x,
});

export const match = (x) => ({
  on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: (fn) => fn(x),
});

// Convert unix timestamp (in second) to local user friendly time
const utsToLocalTime = (uts) => {
  return moment.unix(uts).format("YYYY-MM-DD HH:mm");
}

const getPotType = (potType, purpose = "display") => {
  let result = null;
  const iPotType = _.toInteger(potType);
  if (iPotType >= Pot.POT_TYPES.length)
    throw new Error(`Bad parameter of potType: ${potType}`);

  if (purpose === "display") return forDisplay(Pot.POT_TYPES[iPotType]);
}

const getPotState = (potState, purpose = "display") => {
  let result = null;
  const iPotState = _.toInteger(potState);
  if (iPotState >= Pot.POT_STATES.length)
    throw new Error(`Bad parameter of potState: ${potState}`);

  if (purpose === "display") return forDisplay(Pot.POT_STATES[iPotState]);
}

const isAddrZero = (addr) => {
  return addr.toString().startsWith("0x0000000000000000000");
}

// --- Internal helper functions ---
// Convert "equalShare" => "Equal Share"
const forDisplay = (val) => {
  let res = val.replace(/([A-Z])/g, ' $1').trim();
  return _.toUpper(res);
}

const kickstartBootstrap = () => {
  $('[data-toggle="tooltip"]').tooltip();
}

// --- End of Internal helper functions ---

export default { utsToLocalTime, getPotType, getPotState, kickstartBootstrap,
  isAddrZero }
