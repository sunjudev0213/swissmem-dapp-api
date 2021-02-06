/* eslint-disable no-await-in-loop */
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const NodeCache = require('node-cache');
const {
  MinterAddress,
  rpcEndpointXdai,
  minterDeployedBlock,
  requiredConfirmationXdai,
} = require('../config');
const MinterClass = require('../blockchain/minterClass');
const models = require('../models');
const db = require('../db.js');

const EventStatus = {
  WAITING: 'Waiting',
  PROCESSED: 'Processed',
};

const web3 = new Web3(rpcEndpointXdai);

const minter = new MinterClass(web3, MinterAddress);
const balanceCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

let lastBlock = 0;
let isFetchingLastEvents = false;
let isProcessingEvents = false;

const setLastBlock = async (blockNumber) => {
  if (lastBlock < blockNumber) {
    lastBlock = blockNumber;
    try {
      await models.blockNumber.upsert({
        networkName: 'xdai',
        lastCheckedBlock: lastBlock,
      });
    } catch (e) {
      console.error('Error on persisting last block', e);
    }
  }
};

const saveDonateEvent = async (event) => {
  const { blockNumber, logIndex, transactionHash, returnValues } = event;
  const { sender, token, receiverId, amount, receivedCSTK, homeTx } = returnValues || {};
  const model = {
    blockNumber,
    logIndex,
    transactionHash,
    sender: sender.toLowerCase(),
    token,
    receiverId,
    amount,
    receivedCSTK,
    homeTx,
    status: EventStatus.WAITING,
  };
  try {
    await models.donate.create(model);
  } catch (e) {
    console.error('error on saving new event:', event, e);
  }
};

const getPastEvents = async () => {
  const fetchBlockNumber = (await web3.eth.getBlockNumber()) - requiredConfirmationXdai;
  if (lastBlock < fetchBlockNumber && !isFetchingLastEvents) {
    isFetchingLastEvents = true;
    lastBlock += 1;
    try {
      console.log(`Fetching event between block ${lastBlock} to ${fetchBlockNumber}`);
      const events = await minter.getPastEvents(lastBlock, fetchBlockNumber);

      if (events.length > 0) {
        await Promise.all[events.map(saveDonateEvent)];
      }

      await setLastBlock(fetchBlockNumber);
    } catch (e) {
      console.error('error on fetching last events', e);
    } finally {
      isFetchingLastEvents = false;
    }
  }
};

const processWaitingEvents = async () => {
  if (!isProcessingEvents) {
    isProcessingEvents = true;
    let event;
    try {
      do {
        event = await models.donate.findOne({ where: { status: EventStatus.WAITING } });

        if (event) {
          const { transactionHash, sender, amount } = event;
          console.log('Handling event:', { transactionHash, sender, amount });
          const prevBalance = await models.balance.findOne({ where: { address: sender } });
          const balance = new BigNumber(prevBalance ? prevBalance.balance : 0)
            .plus(amount)
            .toFixed();

          // Init transaction
          const t = await db.sequelize.transaction();

          try {
            await models.balance.upsert({
              address: sender,
              balance,
            });
            await models.donate.update(
              { status: EventStatus.PROCESSED },
              { where: { id: event.id } },
            );
            await t.commit();

            balanceCache.set(sender, balance);
            console.log(`User ${sender} has donated ${amount}, new balance is ${balance}`);
          } catch (_) {
            await t.rollback();
          }
        }
      } while (event !== null); // Not found
    } finally {
      isProcessingEvents = false;
    }
  }
};
const startService = async () => {
  lastBlock = minterDeployedBlock;
  try {
    const xdaiBlockNumber = await models.blockNumber.findOne({ where: { networkName: 'xdai' } });
    if (xdaiBlockNumber && xdaiBlockNumber.lastCheckedBlock)
      lastBlock = xdaiBlockNumber.lastCheckedBlock;
  } catch (e) {
    console.log('error on retrieving last checked block of xdai', e);
  }

  setInterval(async () => {
    await getPastEvents();
    await processWaitingEvents();
  }, 5000); // Update every 5 second
};

startService().then(() => console.log('Balance Watcher started'));

const getUserBalance = async (address) => {
  const addressToLower = address.toLowerCase();
  let balance = balanceCache.get(addressToLower);
  if (balance === undefined) {
    const result = await models.balance.findOne({ where: { address: addressToLower } });
    balance = result.balance;
    balanceCache.set(addressToLower, balance);
  }
  return balance;
};

module.exports = {
  getUserBalance,
};
