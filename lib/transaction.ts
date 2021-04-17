import { WalletAddress } from '../utils/types'
import { SHA256 } from 'crypto-js'
import { ec } from 'elliptic'
import { KeyPair } from './elliptic'
class Transaction {
  fromAddress: WalletAddress
  toAddress: WalletAddress
  amount: number
  signature: string

  constructor(fromAddress: WalletAddress, toAddress: WalletAddress, amount: number) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
    this.signature = ''
  }

  /**
   * Calculates the transaction hash includes **fromAddress**
   * **toAddress** and **amount** as inputs
   * 
   * @returns {string}
   */
  calculateTxHash(): string {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
  }

  /**
   * Signs the transaction with wallet keyPair, 
   * you can only sign transactions for your own wallets 
   * only 
   * 
   * @param {ec.KeyPair} signingKey 
   */
  signTrx(signingKey: ec.KeyPair): void {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets')
    }

    const txHash = this.calculateTxHash()
    const signature = signingKey.sign(txHash, 'base64');
    this.signature = signature.toDER('hex')
  }


  /**
   * Validates a transaction, checks if fromAddress is 
   * null then the transaction was initiated via system 
   * and checks signature
   * 
   * @returns {boolean}
   */
  isValidTx(): boolean {
    if (this.fromAddress === null) return true

    if (!this.signature || !this.signature.length) {
      throw new Error('No signature in this transaction')
    }

    const publicKey = KeyPair.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateTxHash(), this.signature)
  }
}

export default Transaction