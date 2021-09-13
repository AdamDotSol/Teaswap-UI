import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, ColumnType } from '@pancakeswap-libs/uikit'

import Row, { RowProps } from './Row'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  margin: 16px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const MatchTable: React.FC<ITableProps> = (props) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'match' })

  return (
    <Container>
      <TableWrapper ref={tableWrapperEl}>
        <StyledTable>
          <TableBody>
            {rows.map((row) => {
              return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
            })}
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </Container>
  )
}

export default MatchTable
