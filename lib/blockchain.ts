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
    return new Block('01/01/2020', { username: 'umair' }, 0)
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }


  minePendingTransactions(miningRewardAddress: WalletAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mineBlock(this.difficulty)
    this.chain.push(block)

    this.pendingTransactions = [
      // give rewards to miner as a transaction from the system
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction: Transaction): Transaction {
    this.pendingTransactions.push(transaction)
    return transaction
  }

  getBalanceOfAddress(address: WalletAddress) {
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