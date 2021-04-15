import { WalletAddress } from '../utils/types'
import Block from './block'
import Transaction from './transaction'
import _ from 'lodash'

class Blockchain {
  chain: Array<Block>
  difficulty: number
  pendingTransactions: Array<Transaction>
  miningReward: number

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 1
    this.pendingTransactions = []
    this.miningReward = 100
  }

  createGenesisBlock(): Block {
    const newTransaction = new Transaction(null, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 10)
    return new Block('01/01/2020', [newTransaction], 0)
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }


  minePendingTransactions(miningRewardAddress: WalletAddress) {
    // mine a block with pending transactions but doesn't add it to chain yet 
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mineBlock(this.difficulty)
    // point to the previous block hash
    block.previousHash = this.chain[this.chain.length - 1].hash

    const miningRewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward)
    this.chain.push(block)

    // reset transactions and give rewards to miner as a transaction from the system
    this.pendingTransactions = [miningRewardTransaction]
  }

  createTransaction(transaction: Transaction): Transaction {
    this.pendingTransactions.push(transaction)
    return transaction
  }

  getBalanceOfAddress(address: WalletAddress): number {
    let balance = 0

    this.chain.forEach((block: Block) => {
      /* 
      goes over every block and then every transaction in that block to
      collect inputs, outputs and determing the balance of address
      */
      block.transactions.forEach((trx: Transaction) => {

        // outgoing transaction will decrease the balance
        if (trx.fromAddress === address) {
          balance -= trx.amount
        }

        // incoming transaction will decrease the balance
        if (trx.toAddress === address) {
          balance += trx.amount
        }
      })
    })

    return balance
  }

  isChainValid(): boolean {
    return this.chain.every(this.checkBlockValidity)
  }

  checkBlockValidity(block: Block, blockIndex: number): boolean {
    // do not include the genesis block in validation
    if (blockIndex === 0) return true

    const currentBlock = block
    const previousBlock = this.chain[blockIndex - 1]

    // Recalculate hash for integrity of data manipulation
    if (currentBlock.hash !== currentBlock.calculateHash()) return false

    if (currentBlock.previousHash !== previousBlock.hash) return false

    return true
  }
}

export default Blockchain