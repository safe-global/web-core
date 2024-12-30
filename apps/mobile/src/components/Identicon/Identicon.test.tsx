import React from 'react'
import { render } from '@testing-library/react-native'
import { Identicon } from './index'

describe('Identicon', () => {
  it('renders correctly with address', () => {
    const { getByTestId } = render(<Identicon address="0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6" />)
    const image = getByTestId('identicon-image')
    expect(image).toBeTruthy()
  })

  it('applies rounded style when rounded prop is true', () => {
    const { getByTestId } = render(<Identicon address="0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6" rounded />)
    const image = getByTestId('identicon-image')
    expect(image.props.style.borderRadius).toBe('50%')
  })

  it('applies default size when size prop is not provided', () => {
    const { getByTestId } = render(<Identicon address="0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6" />)
    const image = getByTestId('identicon-image')
    expect(image.props.style.width).toBe(56)
    expect(image.props.style.height).toBe(56)
  })

  it('applies custom size when size prop is provided', () => {
    const { getByTestId } = render(<Identicon address="0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6" size={100} />)
    const image = getByTestId('identicon-image')
    expect(image.props.style.width).toBe(100)
    expect(image.props.style.height).toBe(100)
  })
})