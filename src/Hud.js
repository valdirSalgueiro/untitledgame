import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import useStore from './store'

export default function Hud() {
  const points = useStore(state => state.points)
  const distance = useStore(state => state.distance)
  const playerName = useStore(state => state.playerName)
  const isAlive = useStore(state => state.isAlive)
  const spawned = useStore(state => state.spawned)
  const sound = useStore(state => state.sound)
  const connected = useStore(state => state.connected)
  const toggle = useStore(state => state.actions.toggleSound)
  let offline = <></>

  if (!connected) {
    offline = (
      <Offline>
        <h1>Offline</h1>
      </Offline>
    )
  }

  if (spawned)
    if (isAlive) {
      return (
        <>
          <LowerLeft>
            <h2>{distance}</h2>
            <h1>{points}</h1>
          </LowerLeft>
          {offline}
          <Global />
        </>
      )
    } else {
      return (
        <>
          <Wasted>
            <h2>Wasted</h2>
          </Wasted>
          {offline}
          <Global />
        </>
      )
    }
  else {
    return (
      <>
        <Title>Cosmo Revolution</Title>
        <LowerLeft>
          <h2>{playerName}</h2>
        </LowerLeft>
        {offline}
        <UpperLeft onClick={() => toggle()}>
          sound
          <br />
          {sound ? 'off' : 'on'}
        </UpperLeft>
        <UpperRight>
          <a href="https://codesandbox.io/s/react-three-fiber-untitled-game-4pp5r">original source</a>
          <br />
          <a href="https://twitter.com/0xca0a">original creator twitter</a>
          <br />
          <a href="https://github.com/valdirSalgueiro/untitledgame">github</a>
        </UpperRight>
        <Global />
      </>
    )
  }
}

const base = css`
  font-family: 'Teko', sans-serif;
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  font-variant-numeric: slashed-zero tabular-nums;
  line-height: 1em;
  pointer-events: none;
  color: indianred;
`

const Wasted = styled.div`
  ${base}
  text-align: center;
  vertical-align: middle;
  top: 200px;
  left: 0px;
  width: 100%;
  height: 100%;
  filter: blur(0.5px);
  color: rgb(207, 207, 257);
  margin: 0;
  font-size: 12em;
  line-height: 1em;
`

const Title = styled.div`
  ${base}
  text-align: center;
  vertical-align: middle;
  top: 200px;
  left: 0px;
  width: 100%;
  height: 100%;
  filter: blur(0.5px);
  color: rgb(207, 207, 257);
  margin: 0;
  font-size: 15em;
  line-height: 1em;
  text-shadow: 0px 0px 1px rgb(167, 167, 167), 0px 1px 1px rgb(167, 167, 167), 0px 2px 1px rgb(167, 167, 167), 1px 1px 1px rgb(167, 167, 167), 1px 2px 1px rgb(167, 167, 167),
    1px 3px 1px rgb(167, 167, 167), 2px 2px 1px rgb(167, 167, 167), 2px 3px 1px rgb(167, 167, 167), 2px 4px 1px rgb(167, 167, 167), 1px 10px 30px rgba(0, 0, 0, 0.8),
    1px 10px 70px rgba(0, 0, 0, 0.8), 0px 5px 5px rgba(0, 0, 0, 0.8), -5px 5px 20px rgba(0, 0, 0, 0.8), 5px 5px 20px rgba(0, 0, 0, 0.8), 1px 1px 120px rgba(255, 255, 255, 0.5);
  ::after {
    content: 'Cosmo Revolution';
    position: absolute;
    text-align: center;
    vertical-align: middle;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    text-shadow: 0px 0px 100px rgba(11, 124, 199, 0.5);
    animation: cycle 10s linear infinite;
  }
  @keyframes cycle {
    0% {
      text-shadow: 0px 0px 100px rgba(11, 124, 199, 0.5);
    }
    20% {
      text-shadow: 0px 0px 100px rgba(168, 11, 199, 0.5);
    }
    40% {
      text-shadow: 0px 0px 100px rgba(11, 199, 96, 0.5);
    }
    60% {
      text-shadow: 0px 0px 100px rgba(199, 11, 11, 0.5);
    }
    80% {
      text-shadow: 0px 0px 100px rgba(199, 96, 11, 0.5);
    }
  }
`
const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    user-select: none;
    overflow: hidden;
  }

  #root {
    overflow: auto;
    padding: 0px;
  }

  body {
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
    color: black;
    background: white;
  }
`
const Offline = styled.div`
  ${base}
  text-align: center;
  vertical-align: middle;
  top: 400px;
  width: 100%;
  height: 100%;
  color: yellow;
  & > h1 {
    margin: 0;
    font-size: 14em;
    line-height: 1em;
  }
  & > h2 {
    margin: 0;
    font-size: 4em;
    line-height: 1em;
  }
  @media only screen and (max-width: 900px) {
    bottom: 30px;
    & > h1 {
      font-size: 6em !important;
    }
    & > h2 {
      font-size: 3em !important;
    }
  }
`

const LowerLeft = styled.div`
  ${base}
  bottom: 5px;
  left: 50px;
  transform: skew(-5deg, -10deg);
  width: 200px;
  & > h1 {
    margin: 0;
    font-size: 14em;
    line-height: 1em;
  }
  & > h2 {
    margin: 0;
    font-size: 4em;
    line-height: 1em;
  }
  @media only screen and (max-width: 900px) {
    bottom: 30px;
    & > h1 {
      font-size: 6em !important;
    }
    & > h2 {
      font-size: 3em !important;
    }
  }
`

const UpperLeft = styled.div`
  ${base}
  top: 40px;
  left: 50px;
  font-size: 2em;
  transform: skew(5deg, 10deg);
  pointer-events: all;
  cursor: pointer;
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`

const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 40px;
  right: 50px;
  font-size: 2em;
  transform: skew(-5deg, -10deg);
  pointer-events: all;
  cursor: pointer;
  & > a {
    color: indianred;
    text-decoration: none;
  }
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`
