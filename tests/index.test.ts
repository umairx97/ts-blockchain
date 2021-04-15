import tape from 'tape'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'

const nodeCoin = new Blockchain()

tape('initial blockchain params', t => {
  const expectedDifficulty = 1

  t.equal(nodeCoin.difficulty, expectedDifficulty)
  t.equal(nodeCoin.chain.length, 1, 'Should only have genesis block on new blockchain start')
  t.true(nodeCoin.chain[0] instanceof Block, 'Genesis block should be of expected type')
  t.end()
})

tape('create new block with a transaction', t => {
  const timestamp = Date.now()
  const data = {
    username: 'umairx97',
    amount: 10
  }

  const newBlock = new Block(timestamp, data)
  const createdBlock = nodeCoin.addBlock(newBlock)

  t.true(typeof createdBlock.nonce === 'number')
  t.true(createdBlock.hash, 'should generate a unique hash')
  t.equal(nodeCoin.chain.length, 2, 'Should include the new blocks')
  t.deepEqual(createdBlock.transactions, data, 'should not tamper with transaction data')
  t.equal(createdBlock.previousHash, nodeCoin.chain[0].hash, 'should refer to previous block hash')

  t.end()
})
