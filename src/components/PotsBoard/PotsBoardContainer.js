import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';

import PotsBoard from './PotsBoard'
import { log } from '../../services/logging';

// smart contract stuff
import LotteryPot from '../../contracts/LotteryPot.json';
import { withDrizzle } from '../../services/drizzle';

const POT_FILTERS = [ "all", "upcoming", "historical" ];

class PotsBoardContainer extends React.Component {

  constructor(props, context) {
    super(props);
    this.web3 = context.drizzle.web3;
    this.contracts = context.drizzle.contracts;
    this.state = {
      potInfo: null,
    }
  }

  componentDidMount() {
    this.getLotteryPots({ filter: "upcoming", sort: "ascending" })
      .then(potInfo => this.setState({ potInfo }));
  }

  getLotteryPots = async({ filter = "all", sort = "ascending" }) => {
    const { LotteryPotFactory, LotteryPot } = this.contracts;
    const web3 = this.web3;

    const potAddrs = await LotteryPotFactory.methods.getLotteryPots().call();
    let potInfo = await Promise.all(potAddrs
      .map( addr => new web3.eth.Contract(LotteryPot.abi, addr))
      .map( async(contract) => {
        const potName = await contract.methods.potName().call();

        // This is in unix timestamp
        const potClosedDateTime = await contract.methods.closedDateTime().call();
        const potMinStake = await contract.methods.minStake().call();
        const potType = await contract.methods.potType().call();
        const potState = await contract.methods.potState().call();
        const potTotalStakes = await contract.methods.totalStakes().call();
        const potTotalParticipants = await contract.methods.totalParticipants().call();

        return { potName, potClosedDateTime, potMinStake, potType, potState,
          potTotalStakes, potTotalParticipants }
      })
    );

    // filtering
    const currentUTS = moment().unix();
    if (filter === "upcoming")
      potInfo = potInfo.filter(onePot => onePot.potClosedDateTime >= currentUTS);
    else if (filter === "historical")
      potInfo = potInfo.filter(onePot => onePot.potClosedDateTime < currentUTS);

    // sorting

    log(potInfo);
    return potInfo;
  }

  render() {
    return(pug`
      PotsBoard(potInfo=this.state.potInfo)
    `)
  }
}

PotsBoardContainer.contextTypes = {
  drizzle: PropTypes.object,
}

export default withDrizzle(PotsBoardContainer);
