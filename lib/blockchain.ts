import { WalletAddress } from '../utils/types'
import Block from './block'
import Transaction from './transaction'
import _, { add } from 'lodash'

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

  /**
   * creates the genesis block manually and a 
   * transaction is included in it as well
   * 
   * @returns {Block}
   */
  createGenesisBlock(): Block {
    const newTransaction = new Transaction(null, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 10)
    return new Block('01/01/2020', [newTransaction], 0)
  }

  /**
   * gets the latest block on the chain, the last block mined
   * 
   * @returns {Block}
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }


  /**
  * Takes all the pending transactions, puts them in a Block and starts the
  * mining process. It also adds a transaction to send the mining reward to
  * the given address.
  *
  * @param {WalletAddress} miningRewardAddress
  */
  minePendingTransactions(miningRewardAddress: WalletAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)

    block.mineBlock(this.difficulty)
    block.previousHash = this.getLatestBlock().hash

    const miningRewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward)
    this.chain.push(block)

    // add the mining reward transaction to be approved on next block creation
    this.pendingTransactions = [miningRewardTransaction]
  }

  /**
   * Validates and adds the transaction in the block
   * 
   * @param {Transaction} - new transaction in the block 
   * @returns {Transaction} - newly added transaction 
   */
  addTransaction(transaction: Transaction): Transaction {

    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address')
    }


    if (!transaction.isValidTx()) {
      throw new Error('Cannot add invalid transaction in block')
    }

    this.pendingTransactions.push(transaction)
    return transaction
  }

  /**
   * Returns the balance of a given wallet address.
   *
   * @param {WalletAddress} address
   * @returns {number} The balance of the wallet
   */
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

  /**
   * checks every block on the chain and all of the 
   * transactions within each block
   * 
   * @returns {boolean}
   */
  isChainValid(): boolean {
    return this.chain.every(this.checkBlockValidity)
  }

  checkBlockValidity(block: Block, blockIndex: number): boolean {
    // do not include the genesis block in validation
    if (blockIndex === 0) return true

    const currentBlock = block
    const previousBlock = this.chain[blockIndex - 1]

    if (!currentBlock.hasValidTransactions) return false

    // Recalculate hash for integrity of data manipulation
    if (currentBlock.hash !== currentBlock.calculateHash()) return false

    if (currentBlock.previousHash !== previousBlock.hash) return false

    return true
  }
  
  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @returns {Transaction[]}
   */
   getAllTransactionsForAddress (address: WalletAddress): Array<Transaction> {
    const transactions: Array<Transaction> = []

    this.chain.forEach((block: Block) => {
      block.transactions.forEach((tx: Transaction) => {
        // collect any transaction that had the one of the addresses associated
        if(tx.fromAddress === address || tx.toAddress === address) {
          transactions.push(tx)
        }
      })
    })

    return transactions
  }
}

export default Blockchain