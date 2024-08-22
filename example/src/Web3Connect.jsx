import { useAccount, createStorage, useDisconnect } from 'wagmi'

const Web3ConnectButton = (props) => {
  const { address, clear, openModal, setOpen, openWeb3Modal } = props

  const { isConnecting, isDisconnected, isReconnecting } = useAccount()
  const { connectors, disconnect } = useDisconnect()

  const handleClick = () => {
    if (address) {
      localStorage.removeItem('@w3m-storage/SOCIAL_USERNAME')
      localStorage.removeItem('@w3m/connected_social')
      localStorage.removeItem('@w3m-storage/EMAIL')
      localStorage.removeItem('@w3m-storage/EMAIL_LOGIN_USED_KEY')
      localStorage.removeItem('@w3m-storage/LAST_USED_CHAIN_KEY')
      localStorage.removeItem('@w3m-storage/SMART_ACCOUNT_ENABLED_NETWORKS')
      localStorage.removeItem('wagmi.recentConnectorId')
      localStorage.removeItem('@w3m/connected_connector')
      localStorage.removeItem('wagmi.store')

      disconnect()
      clear()
      openModal()
      // openWeb3Modal()
    } else {
      openModal()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting || isReconnecting ? true : undefined}
    >
      {address
        ? `0x${address.substring(0, 2)}...${address.substring(
            address.length - 5
          )}`
        : 'Connect Web3 Wallet'}
    </button>
  )
}

export default Web3ConnectButton
