import Blockchain from './lib/blockchain'
import Transaction from './lib/transaction'
import { KeyPair } from './lib/elliptic'

const nodeCoin = new Blockchain()

const myKey = KeyPair.keyFromPrivate('e8da4ce84c5711abf5b3e086c0cf0686375d3985dafbd8d1573501373d90c1f0')
const myWalletAddress = myKey.getPublic('hex')
const toAddress = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
const rewardAddress = toAddress
const amount = 20

const trx = new Transaction(myWalletAddress, toAddress, amount)
trx.signTrx(myKey)
nodeCoin.addTransaction(trx)

nodeCoin.minePendingTransactions(rewardAddress)

console.log({ chain: nodeCoin.chain })

