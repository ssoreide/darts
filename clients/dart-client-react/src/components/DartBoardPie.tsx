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

const StyledSpan = styled('span')((props: SpanProps) => `
  width: ${props.size}px;
  height: ${props.size}px;
  border-radius: 0 ${props.size}px 0 0;
  transform-origin: 0 ${props.size}px;
  background: ${props.color};
  left: 0px;
  top: 0px;
  display: block;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
  transform: skewX(72deg);
  position: absolute;
  pointer-events: auto;
  overflow: hidden;
  cursor:pointer;
  &:hover {
    background: white;
  }
`)

const StyledDiv = styled('div')((props: DivProps) => `
  width: ${props.size}px;
  height: ${props.size}px;
  left: ${props.size}px;
  transform-origin: 0 ${props.size}px;
  position: absolute;
  overflow: hidden;
  top: 0px;
  transform: rotate(${props.rotate}deg) skewX(-72deg);
  pointer-events: none;
  cursor:pointer;
  &:hover {
    background: white;
  }
`)

const Pie: FC<PieProps> = ({ size, color, rotate, number, onClick }): ReactElement => {
  return (
    <StyledDiv onClick={ev => onClick(number)} size={size} rotate={rotate}><StyledSpan size={size} color={color}></StyledSpan></StyledDiv>
  );
};

export default Pie;