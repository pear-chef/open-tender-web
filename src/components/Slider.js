import React, { useRef, useState, useEffect } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import iconMap from './iconMap'
import { isBrowser } from 'react-device-detect'
import { BackgroundContent, BackgroundImage } from '.'
import { useSwipeable } from 'react-swipeable'

const ArrowView = styled('div')`
  position: absolute;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.colors.light};
  cursor: pointer;
  transition: ${(props) => props.theme.links.transition};
  left: ${(props) => (props.direction === 'left' ? '0.5rem' : 'auto')};
  right: ${(props) => (props.direction === 'right' ? '0.5rem' : 'auto')};
  opacity: ${(props) => (props.disabled ? '0.5' : '1.0')};

  &:hover {
    opacity: 0.5;
  }
`

const Arrow = ({ direction, size, disabled, onClick }) => {
  return (
    <ArrowView
      direction={direction}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {direction === 'left' ? iconMap.ChevronLeft : iconMap.ChevronRight}
    </ArrowView>
  )
}

Arrow.displayName = 'Arrow'
Arrow.propTypes = {
  direction: propTypes.string,
  size: propTypes.string,
  disabled: propTypes.bool,
  onClick: propTypes.func,
}

const Dots = styled('div')`
  position: absolute;
  z-index: 11;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${(props) => props.theme.layout.padding};
  height: ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    // height: ${(props) => props.theme.layout.paddingMobile};
    height: 3rem;
    padding: 0;
    justify-content: center;
    align-items: center;
  }
`

const Dot = styled('button')`
  width: 100%;
  margin: 0 0.2rem;
  height: 0.4rem;
  border-radius: 0.2rem;
  background-color: ${(props) => props.theme.colors.light};
  max-width: ${(props) => (props.active ? '2rem' : '0.4rem')};
  opacity: ${(props) => (props.active ? '1' : '0.5')};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-width: ${(props) => (props.active ? '1.5rem' : '0.3rem')};
    height: 0.3rem;
    border-radius: 0.15rem;
  }
`

const SliderView = styled('div')`
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  // display: flex;
`

const SliderSwipeWrapper = styled('div')`
  display: flex;
  height: 100%;
`

const Slide = styled('div')`
  position: absolute;
  z-index: ${(props) => props.index};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  transition: transform ${(props) => props.transition}ms ease;
  opacity: ${(props) => (props.active ? '1' : '0')};
  transform: translate3D(${(props) => props.shift.toFixed(2)}%, 0, 0);
`

const defaultSettings = {
  autoplay: false,
  transition: 1000,
  transition_mobile: 500,
  duration: 3000,
  duration_mobile: 2500,
  show_arrows: true,
  show_arrows_mobile: false,
  show_dots: true,
  show_dots_mobile: true,
}

const SliderNew = ({ settings = {}, slides }) => {
  const timer = useRef(null)
  const slider = useRef(null)
  const [pause, setPause] = useState(false)
  const [index, setIndex] = useState(0)
  const [lastIndex, setLastIndex] = useState(0)
  const {
    autoplay,
    transition,
    // transition_mobile,
    duration,
    duration_mobile,
    show_arrows,
    show_arrows_mobile,
    show_dots,
    show_dots_mobile,
  } = settings || defaultSettings
  const transitionSpeed = isBrowser ? transition : 200
  const interval = isBrowser ? duration : duration_mobile
  const showArrows = isBrowser ? show_arrows : show_arrows_mobile
  const showDots = isBrowser ? show_dots : show_dots_mobile
  const size = isBrowser ? '3rem' : '2rem'
  const count = slides.length
  const last = count - 1
  const prevIndex = index === 0 ? last : index - 1
  const nextIndex = index === last ? 0 : index + 1
  const moveLeft =
    (index > lastIndex && !(index === last && lastIndex === 0)) ||
    (index === 0 && lastIndex === last)
  const moveRight = !moveLeft

  const config = {
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
  }

  useEffect(() => {
    if (autoplay) {
      timer.current = setInterval(() => {
        const idx = index === count - 1 ? 0 : index + 1
        if (!pause) {
          setLastIndex(index)
          setIndex(idx)
        }
      }, interval)
      return () => {
        clearInterval(timer.current)
      }
    }
  }, [index, count, interval, pause, autoplay])

  useEffect(() => {
    if (autoplay && slider.current) {
      slider.current.addEventListener('mouseover', () => {
        setPause(true)
      })
      slider.current.addEventListener('mouseout', () => {
        setPause(false)
      })
    }
  }, [slider, autoplay])

  const showSlide = (evt, idx) => {
    if (evt) {
      evt.preventDefault()
      evt.target.blur()
    }
    if (idx >= 0 && idx <= count - 1) {
      setLastIndex(index)
      setIndex(idx)
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => showSlide(null, index === last ? 0 : index + 1),
    onSwipedRight: () => showSlide(null, index === 0 ? last : index - 1),
    ...config,
  })

  return (
    <SliderView ref={slider}>
      <SliderSwipeWrapper {...handlers}>
        {slides.map((slide, idx) => {
          const shift = idx === index ? 0 : idx === prevIndex ? -100 : 100
          const active =
            idx === index ||
            (moveLeft && idx === prevIndex) ||
            (moveRight && idx === nextIndex)
          return (
            <Slide
              key={slide.imageUrl}
              transition={transitionSpeed}
              index={idx}
              shift={shift}
              active={active}
            >
              <BackgroundImage {...slide}>
                <BackgroundContent {...slide} />
              </BackgroundImage>
            </Slide>
          )
        })}
      </SliderSwipeWrapper>
      {showArrows && (
        <>
          <Arrow
            direction="left"
            size={size}
            onClick={(evt) => showSlide(evt, index === 0 ? last : index - 1)}
          />
          <Arrow
            direction="right"
            size={size}
            onClick={(evt) => showSlide(evt, index === last ? 0 : index + 1)}
          />
        </>
      )}
      {showDots && (
        <Dots>
          {slides.map((slide, idx) => (
            <Dot
              key={slide.announcement_id}
              onClick={(evt) => showSlide(evt, idx)}
              active={index === idx}
            />
          ))}
        </Dots>
      )}
    </SliderView>
  )
}

SliderNew.displayName = 'SliderNew'
SliderNew.propTypes = {
  settings: propTypes.object,
  slides: propTypes.array,
}

export default SliderNew
