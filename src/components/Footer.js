import styled from '@emotion/styled'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '.'
import logo from '../assets/logo_footer.png'
import packageJson from '../../package.json'

const FooterView = styled('footer')`
  position: relative;
  z-index: 1;
  width: 100%;
  color: ${(props) => props.theme.colors.light};
  background-color: ${(props) => props.theme.bgColors.dark};
`

const FooterContainer = styled('div')`
  height: 18rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: 24rem;
    padding: 0 0 6rem;
  }
`

const FooterLogo = styled('div')`
  max-width: 16rem;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0 0 2rem;
  }

  img {
    display: inline-block;
    margin-top: 0.2rem;
    pointer-events: none;
  }
`

const FooterNav = styled('nav')`
  margin: 0;
  font-size: ${(props) => props.theme.fonts.sizes.small};

  ul li {
    float: left;
    margin: 1.5rem 2rem 0 0;
    &:last-child {
      margin-right: 0;
    }

    a {
      color: ${(props) => props.theme.links.light.color};
    }

    a:hover,
    a:active,
    a:focus {
      color: ${(props) => props.theme.links.light.hover};
    }
  }
`

const FooterVersion = styled('div')`
  position: absolute;
  z-index: 2;
  left: ${(props) => props.theme.layout.padding};
  bottom: 1.5rem;
  color: ${(props) => props.theme.colors.light};
  opacity: 0.3;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    left: ${(props) => props.theme.layout.paddingMobile};
  }
`

const Footer = ({ hasRouter = true }) => {
  return (
    <FooterView role="contentinfo">
      <Container>
        <FooterContainer>
          <FooterLogo>
            <span>Powered by</span>
            <img src={logo} alt="Open Tender Logo" />
          </FooterLogo>
          <FooterNav aria-label="Legal Policies Navigation">
            <ul>
              <li>
                <a
                  href="https://www.opentender.io/terms"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="https://www.opentender.io/privacy"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Privacy
                </a>
              </li>
              {hasRouter && (
                <>
                  <li>
                    <Link to="/accessibility">Accessibility</Link>
                  </li>
                  <li>
                    <Link to="/refunds">Refunds</Link>
                  </li>
                </>
              )}
            </ul>
          </FooterNav>
        </FooterContainer>
      </Container>
      <FooterVersion aria-hidden="true">v{packageJson.version}</FooterVersion>
    </FooterView>
  )
}

Footer.displayName = 'Footer'

export default Footer
