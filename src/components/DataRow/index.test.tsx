import React from 'react'
import { render } from '@testing-library/react-native'
import { DataRow } from './index'
import { Text } from 'react-native'

describe('DataRow', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <DataRow>
        <Text>Test Child</Text>
      </DataRow>,
    )
    expect(getByText('Test Child')).toBeTruthy()
  })

  it('applies the correct styles', () => {
    const { getByTestId } = render(
      <DataRow testID="data-row">
        <Text>Test Child</Text>
      </DataRow>,
    )
    const dataRow = getByTestId('data-row')
    expect(dataRow.props.style).toMatchObject({
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
    })
  })
})

describe('DataRow.Label', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<DataRow.Label>Label</DataRow.Label>)
    expect(getByText('Label')).toBeTruthy()
  })

  it('applies the correct styles', () => {
    const { getByText } = render(<DataRow.Label>Label</DataRow.Label>)
    const label = getByText('Label')
    expect(label.props.style).toMatchObject({
      fontWeight: 'bold',
    })
  })
})

describe('DataRow.Value', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<DataRow.Value>Value</DataRow.Value>)
    expect(getByText('Value')).toBeTruthy()
  })
})

describe('DataRow.Header', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<DataRow.Header>Header Child</DataRow.Header>)
    expect(getByText('Header Child')).toBeTruthy()
  })

  it('applies the correct styles', () => {
    const { getByText } = render(<DataRow.Header>Header Child</DataRow.Header>)
    const header = getByText('Header Child')
    expect(header.props.style).toMatchObject({
      fontWeight: '600',
    })
  })
})