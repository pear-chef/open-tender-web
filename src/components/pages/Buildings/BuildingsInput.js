import { useCallback, useState } from 'react'
import debounce from 'lodash/debounce'
import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { Search, XCircle } from 'react-feather'
import { Box, ButtonIcon } from '@open-tender/components'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../../slices'

const LabelView = styled(Box)`
  width: 100%;
  max-width: 56rem;
  padding: 2rem;
  margin: 2rem auto 4rem;
`

const Label = styled('label')`
  position: relative;
  display: block;
  width: 100%;
`

const LabelInput = styled('input')`
  padding-left: 5rem;

  // &::placeholder {
  //   color: ${(props) => props.theme.colors.primary};
  // }
`

const LabelIcon = styled('span')`
  position: absolute;
  top: 0;
  left: 0;
  width: 5rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LabelClear = styled('span')`
  position: absolute;
  top: 0;
  right: 0;
  width: 5rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    width: 1.8rem;
    height: 1.8rem;

    &:hover,
    &:active,
    &:focus {
      svg {
        stroke: ${(props) => props.theme.buttons.colors.primary.bgColor};
      }
    }
  }
`

const BuildingsInput = ({ value, setValue }) => {
  const [text, setText] = useState(value || '')
  const theme = useSelector(selectTheme)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((value) => setValue(value), 500),
    []
  )

  const handleChange = (evt) => {
    setText(evt.target.value)
    debouncedUpdate(evt.target.value)
  }

  const handleClear = () => {
    setText('')
    setValue('')
  }

  return (
    <LabelView>
      <Label>
        <LabelIcon>
          <Search
            size={18}
            color={theme.colors.primary}
            // color={theme.buttons.colors.primary.bgColor}
          />
        </LabelIcon>
        <LabelInput
          as="input"
          aria-label="Filter buildings"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="enter building name or address"
        />
        {text && (
          <LabelClear>
            <ButtonIcon onClick={handleClear}>
              <XCircle
                size={18}
                // color={theme.colors.primary}
                // color={theme.buttons.colors.primary.bgColor}
              />
            </ButtonIcon>
          </LabelClear>
        )}
      </Label>
    </LabelView>
  )
}

BuildingsInput.displayName = 'BuildingsInput'
BuildingsInput.propTypes = {
  value: propTypes.string,
  setValue: propTypes.func,
}

export default BuildingsInput
