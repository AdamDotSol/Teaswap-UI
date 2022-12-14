import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { useDispatch } from 'react-redux'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getContract } from 'utils/erc20'
import { useVaultUser, useLpTokenPrice, usePriceCakeBusd, usePricePanCakeBusd } from 'state/hooks'
import { fetchVaultUserDataAsync } from 'state/vaults'
import { FarmWithStakedValue } from 'views/Vaults/components/VaultCard/FarmCard'
import { useERC20 } from 'hooks/useContract'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useApproveFarm from '../../../hooks/useApproveFarm'
import { ActionContainer, ActionTitles, ActionContent, Earned } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean,
  depositFeeBP?: number
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  id,
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
  depositFeeBP,
  isTokenOnly,
  sharesTotal,
  wantLockedTotal
}) => {
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance, earnings } = useVaultUser(pid, id)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const location = useLocation()
  // const lpPrice = useLpTokenPrice(lpSymbol)
  let lpPrice = new BigNumber(1);
  const sugarPrice = usePriceCakeBusd()
  const cakePrice = usePricePanCakeBusd()

  if (lpSymbol === 'SUGAR') {
    lpPrice = sugarPrice;
  } else if (lpSymbol === 'CAKE') {
    lpPrice = cakePrice;
  } else if (lpSymbol === 'BANANA') {
    lpPrice = new BigNumber(1.84)
  }

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses: quoteToken.address,
    quoteTokenSymbol: quoteToken.symbol,
    tokenAddresses: token.address,
  })
  const tokenAddress = token.address[process.env.REACT_APP_CHAIN_ID]

  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    await onStake(amount)
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount, "0")
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(earnings)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(earnings).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
  }, [earnings])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={handleStake} tokenName={lpSymbol} depositFeeBP={depositFeeBP} />
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={earnings} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )
  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])
  const dispatch = useDispatch()
  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  if (!account) {
    return (
      <ActionContainer>
        <UnlockButton width="100%" />
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (earnings.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
              {lpSymbol}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              Staked
            </Text>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance()}</Earned>
              {earnings.gt(0) && lpPrice.gt(0) && (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={10}
                  value={getBalanceNumber(lpPrice.times(earnings))}
                  unit=" USD"
                  prefix="~"
                />
              )}
            </div>
            <IconButtonWrapper>
              <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton
                variant="secondary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                <AddIcon color="primary" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <Button
          width="100%"
          onClick={onPresentDeposit}
          variant="secondary"
          disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
        >
          Stake {lpSymbol}
        </Button>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <Skeleton width={180} marginBottom={28} marginTop={14} />
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
        Approve
      </Button>
    </ActionContainer>
  )
}

export default Staked
