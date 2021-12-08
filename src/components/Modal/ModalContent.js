import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { Heading } from '@open-tender/components'

import { ModalClose } from '.'

const ModalContentView = styled('div')`
  padding: 3.5rem 3.5rem 4rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 2.5rem 2.5rem 3rem;
  }
`

const ModalHeader = styled('div')`
  margin: 0 0 2.5rem;
`

const ModalTitle = styled('p')`
  margin: 0;
  line-height: 1;
  font-size: ${(props) => props.theme.fonts.sizes.h3};
`

const ModalSubtitle = styled('div')`
  p {
    margin-top: 1rem;
    line-height: ${(props) => props.theme.lineHeight};
  }
`

const ModalBody = styled('div')`
  & > div {
    & > p {
      margin: 1em 0;
      line-height: ${(props) => props.theme.lineHeight};

      button {
        margin: 0 1rem 1rem 0;
        &:last-child {
          margin: 0;
        }
      }
    }
  }

  // > div + div {
  //   margin: ${(props) => props.theme.layout.padding} 0 0;
  // }
`

const ModalFooter = styled('div')`
  margin-top: 2rem;

  > {
    p {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }
  }

  > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    button {
      flex-shrink: 0;
      display: block;
      margin: 1rem 1rem 0 0;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`

const ModalContent = ({
  close = true,
  title,
  subtitle,
  footer,
  children,
  style,
}) => {
  const hasHeader = title || subtitle ? true : false

  return (
    <>
      <ModalContentView
        role="dialog"
        aria-labelledby="dialogTitle"
        style={style}
      >
        {close && <ModalClose />}
        {hasHeader && (
          <ModalHeader>
            {title && (
              <ModalTitle id="dialogTitle">
                <Heading>{title}</Heading>
              </ModalTitle>
            )}
            {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContentView>
    </>
  )
}

ModalContent.displayName = 'ModalContent'
ModalContent.propTypes = {
  close: propTypes.bool,
  title: propTypes.oneOfType([propTypes.string, propTypes.element]),
  subtitle: propTypes.oneOfType([propTypes.string, propTypes.element]),
  footer: propTypes.oneOfType([propTypes.string, propTypes.element]),
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]),
  style: propTypes.object,
}

export default ModalContent
