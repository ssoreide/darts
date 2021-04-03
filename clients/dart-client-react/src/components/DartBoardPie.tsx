import React, { ReactElement, FC } from "react";
import styled from "styled-components";

interface PieProps {
  size: number;
  color: string;
  rotate: number;
  number: number;
  onClick: (val: number) => void;
}

interface SpanProps {
  size: number;
  color: string;
}

interface DivProps {
  size: number;
  rotate: number;
}

const CommonStyles = `
  top: 0px;
  position: absolute;
  cursor:pointer;
  overflow:hidden;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  &:hover {
    background: white;
  }
  &:active {
    box-shadow: inset 0 2px 15px rgb(0 0 0 / 80%);
  }
`

const InnerSpan = styled('span')((props: SpanProps) => `
  ${CommonStyles}
  width: ${props.size}px;
  height: ${props.size}px;
  border-radius: 0 ${props.size}px 0 0;
  transform-origin: 0 ${props.size}px;
  background: ${props.color};
  left: 0px;
  display: block;
  transform: skewX(72deg);
  pointer-events: auto;
`)

const OuterDiv = styled('div')((props: DivProps) => `
  ${CommonStyles}
  width: ${props.size}px;
  height: ${props.size}px;
  left: ${props.size}px;
  transform-origin: 0 ${props.size}px;
  transform: rotate(${props.rotate}deg) skewX(-72deg);
  pointer-events: none;
`)

const Pie: FC<PieProps> = ({ size, color, rotate, number, onClick }): ReactElement => {
  return (
    <OuterDiv onClick={ev => onClick(number)} size={size} rotate={rotate}><InnerSpan size={size} color={color}></InnerSpan></OuterDiv>
  );
};

export default Pie;