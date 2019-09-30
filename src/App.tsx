import React, { useState } from "react"
import styled, { css, keyframes } from "styled-components"

const N: number = Number(process.env.REACT_APP_N)
const progress = keyframes`
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
`
const animation = css`
	animation: ${N}s ${progress} linear;
`

const Wrapper = styled.main`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`
const Image = styled.img`
	display: block;
	width: 100%;
	height: 100%;
	object-fit: contain;
	object-position: center;
`
interface IProgressBarProps {
	isWait: boolean
}
const ProgressBar = styled.div<IProgressBarProps>`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 20px;
	background-color: rgba(122, 122, 122, 0.8);
	${p => (p.isWait ? animation : null)}
`
const Close = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 0;
	border: none;
	background: none;
	cursor: pointer;
	width: 20px;
	&:before,
	&:after {
		position: absolute;
		content: "";
		height: 20px;
		width: 2px;
		background-color: #333;
	}
	&:before {
		transform: rotate(45deg);
	}

	&:after {
		transform: rotate(-45deg);
	}
`
type TOrientation = "vertical" | "horizontal"

function getOrientation(): TOrientation {
	return window.innerHeight > window.innerWidth ? "vertical" : "horizontal"
}

const App: React.FC = () => {
	const [orientation, setOrientation] = useState<TOrientation>(getOrientation())
	const [isWait, setIsWait] = useState<boolean>(true)

	React.useEffect(() => {
		// Отслеживаем изменение ориентации и обновляем в состоянии.
		function observer() {
			setOrientation(orientation === "vertical" ? "horizontal" : "vertical")
		}

		window.addEventListener("orientationchange", observer)

		return () => window.removeEventListener("orientationchange", observer)
	}, [orientation])

	React.useEffect(() => {
		// Через 3 секунды после того, как баннер отрисовался, запускаем таймер.
		const timeoutId = setTimeout(() => {
			setIsWait(false)
		}, 3000)

		return () => clearTimeout(timeoutId)
	}, [])

	const image =
		orientation === "horizontal"
			? process.env.REACT_APP_HORIZONTAL_IMAGE_PATH
			: process.env.REACT_APP_VERTICAL_IMAGE_PATH

	return (
		<Wrapper>
			<Image src={image} />
			{!isWait && <Close />}
			{isWait && <ProgressBar isWait={isWait} />}
		</Wrapper>
	)
}

export default App
