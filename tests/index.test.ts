import tape from 'tape'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'
import Transaction from '../lib/transaction'

const nodeCoin = new Blockchain()

tape('initial blockchain params', t => {
  const expectedDifficulty = 1

  t.equal(nodeCoin.difficulty, expectedDifficulty)
  t.equal(nodeCoin.chain.length, 1, 'Should only have genesis block on new blockchain start')
  t.true(nodeCoin.chain[0] instanceof Block, 'Genesis block should be of expected type')
  t.end()
})

tape('create new block with a transaction', t => {
  const amount = 10

  const fromAddress = '0x0472ec0185ebb8202f3d4ddb0226998889663cf2'
  const toAddress = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const rewardAddress = toAddress

  const newTransaction = nodeCoin.createTransaction(new Transaction(fromAddress, toAddress, amount))
  nodeCoin.minePendingTransactions(rewardAddress)

  t.true(nodeCoin.chain[1].hash, 'should generate a unique hash')
  t.equal(nodeCoin.chain.length, 2, 'Should include the new blocks')
  t.deepEqual(newTransaction.fromAddress, fromAddress, 'should not tamper with transaction data')
  t.deepEqual(newTransaction.toAddress, toAddress, 'should not tamper with transaction data')
  t.deepEqual(newTransaction.amount, amount, 'should not tamper with transaction data')
  t.equal(nodeCoin.chain[1].previousHash, nodeCoin.chain[0].hash, 'should refer to previous block hash')

  t.end()
})

tape('getBalanceOfAddress should get the correct balance by checking inputs and outputs', t => {
  const toAddress = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'

  let balance = nodeCoin.getBalanceOfAddress(toAddress)
  t.equal(balance, 20)

  // include the mining rewards from the last block
  nodeCoin.minePendingTransactions(toAddress)
  balance = nodeCoin.getBalanceOfAddress(toAddress) // recalculate balance after getting mining rewards

  t.equal(balance, 120)
  t.end()
})
