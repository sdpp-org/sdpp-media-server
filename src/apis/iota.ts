import { Request, Response } from 'express';
import * as iotaLibrary from '@iota/core';

import state from '../state';

const HARDCODED__seed = 'YBQMEKEAYMQYCDQF9HAHFDEUEVCYNBRETQBORKIFTNQ9AHGBTPHJFDKEAQXTFFQLTHGPOSHJQEIVNFGIR';

const menu = {
  message_type: 'menu',
  data: {},
  signature: 'from seller',
  verification: '',
}

export function handshake(req, res: Response, next) {
  const iota = iotaLibrary.composeAPI({
    provider: 'https://nodes.devnet.thetangle.org:443'
  });

  iota
    .getNewAddress(HARDCODED__seed, { index: 0, total: 1 })
    .then(addr => {
      console.log('Your address is: ' + addr);

      res.send({
        data: {
          menu: [
            'trojan',
            'ucla',
            'ucsb',
            'uci',
          ],
          payment_address_of_the_seller: addr,
        },
        message_type: 'menu',
        signature: 'from seller',
        verification: '',
      });
    })
    .catch(err => console.log(err));
}

export function pay(req, res, next) {
  state.shouldEmitVideo = false;

  res.send({
    paymentResult: {
      status: 'fail',
    },
  });
}

export function paySucceed(req, res, next) {
  const { targetAddress } = req.body;

  (async () => {
    console.log('sendPayment() addr: %s', targetAddress);

    const iota = iotaLibrary.composeAPI({
      provider: 'https://nodes.devnet.thetangle.org:443'
    });

    const transfers = [
      {
        value: 0,
        address: targetAddress[0],
        tag: 'MYMAGIC'
      }
    ]
    console.log('Sending 0i to ' + targetAddress[0]);

    try {
      // Construct bundle and convert to trytes
      const trytes = await iota.prepareTransfers(HARDCODED__seed, transfers)
      // Send bundle to node.
      const response = await iota.sendTrytes(trytes, 3, 9)

      console.log('Completed Transaction', response[0]);

      state.shouldEmitVideo = true;

      res.send({
        paymentResult: response[0],
      });
    } catch (e) {
      console.log(e);
    }
  })();
}
