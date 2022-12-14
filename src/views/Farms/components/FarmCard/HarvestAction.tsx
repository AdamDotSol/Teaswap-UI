import React, {useState} from 'react'
import BigNumber from 'bignumber.js'
import {Button, Flex, Heading} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import {useHarvest} from 'hooks/useHarvest'
import {getBalanceNumber} from 'utils/formatBalance'
import styled from 'styled-components'
import useStake from '../../../../hooks/useStake'

interface FarmCardActionsProps {
    earnings?: BigNumber
    pid?: number
    type?: string
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({earnings, pid, type}) => {
    const TranslateString = useI18n()
    const [pendingTx, setPendingTx] = useState(false)

    // compound to SUGAR pool
    const {onReward} = useHarvest(pid, type)
    const {onStake} = useStake(3, type)



    const rawEarningsBalance = getBalanceNumber(earnings)
    const displayBalance = rawEarningsBalance.toLocaleString()

    return (
        <Flex mb='8px' justifyContent='space-between' alignItems='center'>
            <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
            <BalanceAndCompound>

                {pid !== 3 ?
                    <Button
                        disabled={rawEarningsBalance === 0 || pendingTx}
                        scale='sm'
                        variant='secondary'
                        marginBottom='15px'
                        onClick={async () => {
                            setPendingTx(true)
                            await Promise.all([
                                onStake(rawEarningsBalance.toString()),
                                onReward()
                            ]);
                            setPendingTx(false)
                        }
                        }
                    >
                        {TranslateString(999, 'Pack it')}
                    </Button>
                    : null}


                {pid === 3 ?
                    <Button
                        disabled={rawEarningsBalance === 0 || pendingTx}
                        scale='sm'
                        variant='secondary'
                        marginBottom='15px'
                        onClick={async () => {
                            setPendingTx(true)
                            await onStake(rawEarningsBalance.toString())
                            setPendingTx(false)
                        }
                        }
                    >
                        {TranslateString(999, 'Pack it')}
                    </Button>
                    : null}
                <Button
                    disabled={rawEarningsBalance === 0 || pendingTx}
                    onClick={async () => {
                        setPendingTx(true)
                        await onReward()
                        setPendingTx(false)
                    }}
                >
                    {TranslateString(999, 'Harvest')}
                </Button>
            </BalanceAndCompound>
        </Flex>
    )
}

export default HarvestAction
