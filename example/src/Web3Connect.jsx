// import { useAccount } from 'wagmi'
import { useAccount, useDisconnect } from 'wagmi'

const Web3ConnectButton = (props) => {
  const { setOpen } = props

  const { address, isConnecting, isDisconnected, isReconnecting, isConnected } =
    useAccount()
  const { disconnect } = useDisconnect()

  console.log('address................. 1', address)
  console.log('isConnected................. 1', isConnected)
  const handleClick = async () => {
    if (address && isConnected) {
      await disconnect()
    } else if (isDisconnected) {
      setOpen(true)
    }
  }

  return (
    <button onClick={handleClick} disable={isConnecting || isReconnecting}>
      {isConnecting
        ? 'Connecting…'
        : isReconnecting
        ? 'Reconnecting...'
        : isDisconnected
        ? 'Connect Web3 Wallet'
        : `0x...${address.substring(address.length - 5)}`}
    </button>
  )
}

export default Web3ConnectButton
