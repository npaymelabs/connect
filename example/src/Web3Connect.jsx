// import { useAccount } from 'wagmi'

const Web3ConnectButton = (props) => {
  const { address, openModal, openWeb3Modal } = props

  // const { isConnecting, isDisconnected, isReconnecting } = useAccount()

  const handleClick = () => {
    if (address) {
      openWeb3Modal()
    } else {
      openModal()
    }
  }

  return (
    <button
      onClick={handleClick}
      // disabled={isConnecting || isReconnecting ? true : undefined}
    >
      {address
        ? `${address.substring(0, 4)}...${address.substring(
            address.length - 4
          )}`
        : 'Connect Web3 Wallet'}
    </button>
  )
}

export default Web3ConnectButton
